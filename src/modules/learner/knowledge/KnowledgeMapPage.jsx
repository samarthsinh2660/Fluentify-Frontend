import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraphCanvas, useSelection } from 'reagraph';
import { ArrowLeft, Brain, RefreshCw, RotateCcw, Loader2, X } from 'lucide-react';
import { useKnowledgeGraph, useRebuildGraph } from '../../../hooks/useRecommendations';

// ─── Color per concept type (Obsidian-style) ──────────────────────────────────
const TYPE_COLOR = {
  vocabulary:   '#818cf8',  // indigo   (blue-purple)
  grammar:      '#f472b6',  // pink     (clearly distinct from indigo)
  conversation: '#2dd4bf',  // teal     (clearly distinct from yellow A* and indigo vocab)
  review:       '#fb923c',  // orange
};

const STATUS_COLOR = {
  mastered:  '#4ade80',   // bright green
  learning:  '#38bdf8',   // sky blue  (was #60a5fa — more distinct from indigo vocab)
  weak:      '#f87171',   // red
  untouched: '#94a3b8',   // slate
};

const STATUS_LABEL = {
  mastered:  '✓ Mastered',
  learning:  '↗ Learning',
  weak:      '⚠ Weak',
  untouched: '○ Not started',
};

// ─── Custom reagraph theme (dark, Obsidian-like) ──────────────────────────────
const DARK_THEME = {
  canvas:  { background: '#0d1117' },
  node: {
    fill:            '#1e293b',
    activeFill:      '#38bdf8',
    opacity:         1,
    selectedOpacity: 1,
    inactiveOpacity: 0.2,
    label: {
      stroke:      '#0d1117',      // dark outline behind text so it reads on any bg
      color:       '#e2e8f0',      // slate-200 — bright enough to read unselected
      activeColor: '#ffffff',      // pure white when selected
      fontSize:    8,              // slightly larger
    },
  },
  lasso: { border: '1px solid #818cf8', background: 'rgba(129,140,248,0.08)' },
  ring:  { fill: '#334155', activeFill: '#38bdf8' },
  edge: {
    fill:            '#475569',    // slate-600 — clearly visible on dark bg
    activeFill:      '#38bdf8',    // sky-blue when node selected
    opacity:         0.9,
    selectedOpacity: 1,
    inactiveOpacity: 0.12,
    label: { stroke: '#0d1117', color: '#94a3b8', activeColor: '#e2e8f0', fontSize: 5 },
  },
  arrow: { fill: '#64748b', activeFill: '#38bdf8' },
  cluster: {
    stroke:          '#1e293b',
    opacity:         0.8,
    selectedOpacity: 1,
    inactiveOpacity: 0.1,
    label: { stroke: '#0d1117', color: '#64748b' },
  },
};

// ─── Build reagraph nodes and edges ──────────────────────────────────────────

const buildGraphData = (nodes, edges, astarPathSet) => {
  const gNodes = nodes.map(n => {
    const onAstar = astarPathSet.has(n.id);
    const color   = onAstar ? '#fde68a' : (TYPE_COLOR[n.conceptType] ?? '#94a3b8');

    // Size by mastery: bigger = more learned
    const size = onAstar         ? 18
               : n.status === 'mastered'  ? 16
               : n.status === 'learning'  ? 12
               : n.status === 'weak'      ? 9
               : 6;

    return {
      id:    String(n.id),
      label: n.conceptLabel,
      // reagraph reads `fill` from the node object to override theme color
      fill:  color,
      size,
      // extra data we need in the click handler
      _type:    n.conceptType,
      _status:  n.status,
      _mastery: n.masteryScore,
      _attempts:n.attempts,
      _onAstar: onAstar,
    };
  });

  const nodeIdSet = new Set(nodes.map(n => String(n.id)));
  const gEdges = edges
    .filter(e => nodeIdSet.has(String(e.fromConceptId)) && nodeIdSet.has(String(e.toConceptId)))
    .map(e => {
      const onAstar = astarPathSet.has(e.fromConceptId) && astarPathSet.has(e.toConceptId);
      return {
        id:     `${e.fromConceptId}->${e.toConceptId}`,
        source: String(e.fromConceptId),
        target: String(e.toConceptId),
        // reagraph reads `fill` from edge object
        fill:   onAstar ? '#fde68a' : undefined,
        size:   onAstar ? 2 : 1,
      };
    });

  return { nodes: gNodes, edges: gEdges };
};

// ─── Node detail panel ────────────────────────────────────────────────────────

const NodePanel = ({ node, onClose }) => {
  if (!node) return null;
  const typeColor   = TYPE_COLOR[node._type]     ?? '#94a3b8';
  const statusColor = STATUS_COLOR[node._status] ?? '#6b7280';
  const pct         = Math.round((node._mastery ?? 0) * 100);

  return (
    <div
      className="absolute top-20 right-4 z-20 text-white"
      style={{
        width: 240,
        background: 'rgba(10,10,20,0.95)',
        border: `1px solid ${typeColor}40`,
        borderRadius: 14,
        boxShadow: `0 4px 24px rgba(0,0,0,0.7)`,
        backdropFilter: 'blur(12px)',
        padding: 16,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-2 min-w-0">
          <span
            className="inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest mb-1.5"
            style={{ backgroundColor: `${typeColor}20`, color: typeColor, border: `1px solid ${typeColor}50` }}
          >
            {node._type}
          </span>
          <p className="font-bold text-sm leading-snug break-words">{node.label}</p>
          <span
            className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}40` }}
          >
            {STATUS_LABEL[node._status]}
          </span>
          {node._onAstar && (
            <span className="inline-block ml-1 mt-1 text-[10px] px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-300 border border-yellow-600/40 font-semibold">
              ⭐ A* priority
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mastery ring */}
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1f2937" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={typeColor} strokeWidth="3.5"
              strokeDasharray={`${pct} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: typeColor }}>
            {pct}%
          </span>
        </div>
        <div className="text-xs text-gray-400 space-y-1">
          <p><span className="text-white font-semibold text-sm">{node._attempts}</span> attempt{node._attempts !== 1 ? 's' : ''}</p>
          <p className="text-gray-600 text-[10px]">Click bg to dismiss</p>
        </div>
      </div>
    </div>
  );
};

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend = () => (
  <div
    className="absolute bottom-6 left-4 z-20 space-y-2"
    style={{
      background: 'rgba(10,10,20,0.90)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: '10px 13px',
      backdropFilter: 'blur(10px)',
      minWidth: 140,
    }}
  >
    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Concept type</p>
    {Object.entries(TYPE_COLOR).map(([type, color]) => (
      <div key={type} className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-300 capitalize">{type}</span>
      </div>
    ))}
    <div className="pt-1.5 border-t border-gray-800 flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shrink-0" />
      <span className="text-xs text-yellow-300">A* path</span>
    </div>
    <div className="pt-1 border-t border-gray-800">
      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Node size</p>
      <p className="text-[10px] text-gray-600">Larger = more mastered</p>
    </div>
  </div>
);

// ─── Stats strip ──────────────────────────────────────────────────────────────

const StatsStrip = ({ stats, edgeCount }) => (
  <div className="absolute top-16 left-4 flex gap-2 z-20 flex-wrap">
    {[
      ['Concepts',  stats.total,     '#e5e7eb'],
      ['Connections', edgeCount,     '#94a3b8'],
      ['Mastered',  stats.mastered,  '#22c55e'],
      ['Learning',  stats.learning,  '#60a5fa'],
      ['Weak',      stats.weak,      '#f87171'],
    ].map(([label, value, color]) => (
      <div
        key={label}
        className="text-center"
        style={{
          background: 'rgba(10,10,20,0.88)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: '5px 10px',
          minWidth: 52,
          backdropFilter: 'blur(8px)',
        }}
      >
        <p className="text-sm font-bold" style={{ color }}>{value}</p>
        <p className="text-[9px] text-gray-600">{label}</p>
      </div>
    ))}
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const KnowledgeMapPage = () => {
  const { courseId } = useParams();
  const navigate     = useNavigate();
  const graphRef     = useRef(null);

  const [selectedNode, setSelectedNode] = useState(null);

  const { data, isLoading, isError, refetch } = useKnowledgeGraph(courseId);
  const rebuildMutation = useRebuildGraph(courseId);

  const graph = data?.data;

  const astarPathSet = useMemo(
    () => new Set((graph?.astarPath ?? []).map(id => Number(id))),
    [graph]
  );

  const { nodes: gNodes, edges: gEdges } = useMemo(
    () => graph?.nodes?.length
      ? buildGraphData(graph.nodes, graph.edges ?? [], astarPathSet)
      : { nodes: [], edges: [] },
    [graph, astarPathSet]
  );

  // useSelection: clicking a node highlights it + all connected edges + neighbours
  const {
    selections,
    actives,
    onNodeClick: selectionNodeClick,
    onCanvasClick: selectionCanvasClick,
    onNodePointerOver,
    onNodePointerOut,
  } = useSelection({
    ref: graphRef,
    nodes: gNodes,
    edges: gEdges,
    pathSelectionType: 'all',   // highlights all connected edges + nodes on click
    pathHoverType: 'all',       // highlights on hover too
    focusOnSelect: true,
  });

  const handleNodeClick = useCallback((node) => {
    selectionNodeClick(node);
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, [selectionNodeClick]);

  const handleCanvasClick = useCallback(() => {
    selectionCanvasClick();
    setSelectedNode(null);
  }, [selectionCanvasClick]);

  const handleRebuild = useCallback(async () => {
    setSelectedNode(null);
    await rebuildMutation.mutateAsync();
    refetch();
  }, [rebuildMutation, refetch]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading || rebuildMutation.isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#030712' }}>
        <Brain className="w-14 h-14 text-indigo-400 animate-pulse" />
        <p className="text-gray-400 text-sm">
          {rebuildMutation.isPending ? 'Rebuilding concept graph with AI…' : 'Loading your knowledge graph…'}
        </p>
        <p className="text-gray-700 text-xs">This may take up to 30 seconds</p>
      </div>
    );
  }

  if (isError || !graph?.nodes?.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center" style={{ background: '#030712' }}>
        <Brain className="w-16 h-16 text-gray-700" />
        <div>
          <p className="text-gray-200 font-semibold text-lg">No concept graph yet</p>
          <p className="text-gray-500 text-sm mt-1 max-w-xs">
            Generate a new course or click "Build Graph" to extract concepts with AI.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRebuild}
            disabled={rebuildMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            {rebuildMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Building…</>
              : <><RotateCcw className="w-4 h-4" /> Build Graph</>}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Graph ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative overflow-hidden" style={{ width: '100vw', height: '100dvh', background: '#030712' }}>

      {/* Header */}
      <header
        className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-30"
        style={{
          background: 'rgba(3,7,18,0.90)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <div className="w-px h-5 bg-gray-800" />
          <Brain className="w-4 h-4 text-indigo-400" />
          <h1 className="text-sm font-bold text-white">Knowledge Graph</h1>
          <span className="text-xs text-gray-600 hidden sm:inline">
            {gNodes.length} concepts · {gEdges.length} connections
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRebuild}
            disabled={rebuildMutation.isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: 'rgba(79,70,229,0.15)',
              border: '1px solid rgba(79,70,229,0.35)',
              color: '#818cf8',
            }}
          >
            {rebuildMutation.isPending
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Rebuilding…</>
              : <><RotateCcw className="w-3.5 h-3.5" /> Rebuild</>}
          </button>
          <button
            onClick={() => refetch()}
            title="Refresh"
            className="p-2 text-gray-500 hover:text-white hover:bg-gray-800/60 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* reagraph canvas — fills whole screen */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 56 }}>
        <GraphCanvas
          ref={graphRef}
          nodes={gNodes}
          edges={gEdges}
          theme={DARK_THEME}
          layoutType="forceDirected3d"
          edgeInterpolation="curved"
          animated
          selections={selections}
          actives={actives}
          onNodeClick={handleNodeClick}
          onCanvasClick={handleCanvasClick}
          onNodePointerOver={onNodePointerOver}
          onNodePointerOut={onNodePointerOut}
          cameraMode="rotate"
          labelType="all"
        />
      </div>

      {/* Overlays */}
      <StatsStrip stats={graph.stats} edgeCount={gEdges.length} />
      <Legend />
      <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />

      <p className="absolute bottom-4 right-4 text-[10px] text-gray-700 z-20 select-none">
        Click node to inspect · Drag to rotate · Scroll to zoom
      </p>
    </div>
  );
};

export default KnowledgeMapPage;
