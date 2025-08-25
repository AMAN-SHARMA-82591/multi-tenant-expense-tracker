import { useChat } from '../utils/contextApi';

const TypingIndicator = () => {
  const { darkMode } = useChat();

  return (
    <div className="flex justify-start">
      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
        {/* Avatar placeholder */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full ${
            darkMode ? 'bg-gray-600' : 'bg-gray-300'
          }`} />
        </div>

        {/* Typing bubble */}
        <div className={`px-4 py-2 rounded-2xl ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div className="flex space-x-1">
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              darkMode ? 'bg-gray-400' : 'bg-gray-500'
            }`} style={{ animationDelay: '0ms' }} />
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              darkMode ? 'bg-gray-400' : 'bg-gray-500'
            }`} style={{ animationDelay: '150ms' }} />
            <div className={`w-2 h-2 rounded-full animate-bounce ${
              darkMode ? 'bg-gray-400' : 'bg-gray-500'
            }`} style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
