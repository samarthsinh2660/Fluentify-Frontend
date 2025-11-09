import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../hooks/useAuth';
import { LogOut, Trophy, Sparkles, BarChart3, Users } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const dashboardCards = [
    {
      title: 'User Management',
      description: 'Manage learner accounts, view details, and reset passwords',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      onClick: () => navigate('/admin/users'),
    },
    {
      title: 'Contest Management',
      description: 'Create, edit, and manage language learning contests',
      icon: Trophy,
      color: 'from-green-500 to-blue-500',
      onClick: () => navigate('/admin-contests'),
    },
    {
      title: 'Generate with AI',
      description: 'Use AI to quickly generate engaging contests',
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/admin-contests/generate'),
    },
    {
      title: 'Analytics',
      description: 'View contest statistics and performance metrics',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      onClick: () => navigate('/admin-contests'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Admin!</h2>
          <p className="text-gray-600">Manage your language learning platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                onClick={card.onClick}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
