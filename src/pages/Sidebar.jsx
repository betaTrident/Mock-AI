import { useNavigate, useLocation } from 'react-router-dom';
import { Book, MessageCircle, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Book },
    { name: 'Lessons', path: '/lessons', icon: Book },
    { name: 'Practice Chat', path: '/practice-chat', icon: MessageCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white p-6 shadow-md h-screen">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <img
            src="src/assets/Colina-2x2.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <h2 className="font-semibold">Kent Colina</h2>
          <p className="text-sm text-gray-500">Beginner</p>
        </div>
      </div>
      
      <nav className="flex flex-col gap-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActivePath(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="my-6 border-t border-gray-200" />

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium">Vocabulary Learned</p>
          <p className="text-2xl font-bold">237 words</p>
        </div>
        <div>
          <p className="text-sm font-medium">Lessons Completed</p>
          <p className="text-2xl font-bold">12</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;