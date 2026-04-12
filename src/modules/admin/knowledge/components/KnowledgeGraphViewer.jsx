import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Brain } from 'lucide-react';
import { useLearnerKnowledgeGraph } from '../../../../hooks/useRecommendations';

// ─── Status → ReactFlow node style ────────────────────────────────────────────
const STATUS_NODE_STYLE = {
  mastered:  { background: '#dcfce7', border: '2px solid #22c55e', color: '#166534' },
  learning:  { background: '#dbeafe', border: '2px solid #3b82f6', color: '#1e40af' },
  weak:      { background: '#fee2e2', border: '2px solid #ef4444', color: '#991b1b' },
  untouched: { background: '#f3f4f6', border: '2px solid #d1d5db', color: '#6b7280' },
};

const ASTAR_EDGE_STYLE = { stroke: '#facc15', strokeWidth: 3 };
const DEFAULT_EDGE_STYLE = { stroke: '#d1d5db', strokeWidth: 1.5 };

// ─── Layout: arrange nodes in rows by concept type ────────────────────────────
const TYPE_ROW = { vocabulary: 0, grammar: 1, conversation: 2, review: 3 };
const ROW_HEIGHT = 160;
const NODE_GAP    = 220;

const layoutNodes = (nodes) => {
  const buckets = { vocabulary: [], grammar: [], conversation: [], review: [] };

  for (const n of nodes) {
    const bucket = buckets[n.conceptType];
    if (bucket) bucket.push(n);
    else buckets.vocabulary.push(n); // fallback
  }

  const result = [];
  for (const [type, group] of Object.entries(buckets)) {
    const row = TYPE_ROW[type] ?? 0;
    group.forEach((n, col) => {
      result.push({
        id:       String(n.id),
        type:     'default',
        data:     { label: buildLabel(n) },
        position: { x: col * NODE_GAP, y: row * ROW_HEIGHT },
        style:    STATUS_NODE_STYLE[n.status] ?? STATUS_NODE_STYLE.untouched,
      });
    });
  }
  return result;
};

const buildLabel = (n) =>
  `${n.conceptLabel}\n${Math.round(n.masteryScore * 100)}% (${n.conceptType})`;

// ─── Component ─────────────────────────────────────────────────────────────────
const KnowledgeGraphViewer = ({ courseId, learnerId }) => {
  const { data, isLoading, isError } = useLearnerKnowledgeGraph(courseId, learnerId);
  const graph = data?.data;

  const astarPathSet = useMemo(
    () => new Set((graph?.astarPath ?? []).map(id => Number(id))),
    [graph]
  );

  const initialNodes = useMemo(() => {
    if (!graph?.nodes) return [];
    return layoutNodes(graph.nodes);
  }, [graph]);

  const initialEdges = useMemo(() => {
    if (!graph?.edges) return [];
    return graph.edges.map(e => {
      const fromOnPath = astarPathSet.has(e.fromConceptId);
      const toOnPath   = astarPathSet.has(e.toConceptId);
      const isAstar    = fromOnPath && toOnPath;
      return {
        id:             String(e.id),
        source:         String(e.fromConceptId),
        target:         String(e.toConceptId),
        animated:       isAstar,
        style:          isAstar ? ASTAR_EDGE_STYLE : DEFAULT_EDGE_STYLE,
        markerEnd:      { type: MarkerType.ArrowClosed, color: isAstar ? '#facc15' : '#d1d5db' },
        label:          e.edgeWeight !== 1 ? e.edgeWeight.toFixed(1) : undefined,
      };
    });
  }, [graph, astarPathSet]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
      </div>
    );
  }

  if (isError || !graph || graph.nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <Brain className="w-10 h-10 mb-3" />
        <p className="text-sm">No knowledge graph available for this learner yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs px-1">
        {Object.entries(STATUS_NODE_STYLE).map(([status, s]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: s.background, border: s.border }} />
            <span className="text-gray-600 capitalize">{status}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-yellow-400" />
          <span className="text-gray-600">A* recommended path</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 text-xs text-center">
        {[
          { label: 'Total',    value: graph.stats.total,     color: 'text-gray-700'  },
          { label: 'Mastered', value: graph.stats.mastered,  color: 'text-green-600' },
          { label: 'Learning', value: graph.stats.learning,  color: 'text-blue-600'  },
          { label: 'Weak',     value: graph.stats.weak,      color: 'text-red-600'   },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg py-2 border border-gray-100">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Graph canvas */}
      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 480 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background gap={16} color="#e5e7eb" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => {
              const bg = n.style?.background;
              return bg ?? '#e5e7eb';
            }}
            maskColor="rgba(0,0,0,0.05)"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default KnowledgeGraphViewer;
