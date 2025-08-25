import { useState, useMemo } from 'react';
import { HiX, HiUserGroup, HiSearch, HiCheck } from 'react-icons/hi';
import { useChat } from '../utils/contextApi';

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const { darkMode, users, currentUser, createGroup } = useChat();
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [step, setStep] = useState(1); // 1: details, 2: members

  // Filter out current user and filter by search
  const availableUsers = useMemo(() => {
    return users
      .filter(user => user.id !== currentUser.id)
      .filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [users, currentUser.id, searchTerm]);

  const handleNext = () => {
    if (groupName.trim()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      const groupData = {
        name: groupName.trim(),
        description: groupDescription.trim(),
        members: selectedUsers,
        avatar: '', // Will use default group avatar
        admins: [currentUser.id]
      };
      
      createGroup(groupData);
      onGroupCreated(groupData);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const isFormValid = groupName.trim() && selectedUsers.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`w-full max-w-md mx-4 rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-2">
            <HiUserGroup className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Create New Group</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 rounded ${
              step >= 2 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-600'
            }`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Group Details</span>
            <span>Add Members</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 1 ? (
            /* Step 1: Group Details */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Enter group description"
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          ) : (
            /* Step 2: Add Members */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <HiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Members ({selectedUsers.length} selected)
                </label>
                <div className={`max-h-48 overflow-y-auto border rounded-lg ${
                  darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  {availableUsers.length === 0 ? (
                    <div className={`p-4 text-center text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {searchTerm ? 'No users found' : 'No users available'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {availableUsers.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedUsers.includes(user.id)
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : ''
                          }`}
                          onClick={() => toggleUserSelection(user.id)}
                        >
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.username}</p>
                            <p className={`text-sm truncate ${
                              darkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {user.email}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedUsers.includes(user.id)
                              ? 'bg-blue-500 border-blue-500'
                              : darkMode
                                ? 'border-gray-500'
                                : 'border-gray-300'
                          }`}>
                            {selectedUsers.includes(user.id) && (
                              <HiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-between p-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {step === 1 ? (
            <div className="w-full">
              <button
                onClick={handleNext}
                disabled={!groupName.trim()}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  groupName.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleBack}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={!isFormValid}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFormValid
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Create Group
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
