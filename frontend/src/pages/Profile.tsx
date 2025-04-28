import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { useUser } from "../hooks";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router";

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Reset edit fields when opening modal
  const openEditModal = () => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setError('');
    setShowModal(true);
  };

  const handleSaveProfile = async () => {
    setError('');

    // Validation
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    
    if (!bio.trim()) {
      setError("Bio cannot be empty");
      return;
    }
    
    if (name.length > 50) {
      setError("Name must be less than 50 characters");
      return;
    }
    
    if (bio.length > 160) {
      setError("Bio must be less than 160 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/user/profile`,
        { name, bio },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.user;
        setUser({
          ...user,
          name: updatedUser.name,
          bio: updatedUser.bio,
          email: user?.email || ''
        });
        setName(updatedUser.name);
        setBio(updatedUser.bio);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show delete confirmation modal
  const confirmDeleteAccount = () => {
    setDeleteConfirmText('');
    setDeleteError('');
    setShowDeleteConfirmation(true);
  };

  // Delete account function
  const deleteAccount = async () => {
    // Validate confirmation text
    if (deleteConfirmText !== 'delete my account') {
      setDeleteError("Please type 'delete my account' to confirm");
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError('');
      
      const response = await axios.delete(`${BACKEND_URL}/api/v1/user/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.data.message === 'Account deleted successfully') {
        // Clear local storage
        localStorage.removeItem('token');
        
        // Log the user out
        localStorage.removeItem('user');
        
        // Redirect to home page
        navigate('/');
      } else {
        throw new Error(response.data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError(error.response?.data?.error || 'Failed to delete account. Please try again later.');
    } finally {
      setIsDeleting(false);
    }
  }; 

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <Appbar />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-12">Settings</h1>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-300 mb-8">
          <div className="flex">
            <button className="px-4 py-2 border-b-2 border-black font-medium">Account</button>
            <button className="px-4 py-2 text-gray-500">Publishing</button>
            <button className="px-4 py-2 text-gray-500">Notifications</button>
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-7">
          <div className="flex justify-between">
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer mb-1">Email address</h2>
            <p className="text-sm text-gray-500">{user?.email || "Not available"}</p>
          </div>

          <div className="flex justify-between">
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1 cursor-pointer">Username and subdomain</h2>
            <p className="text-sm text-gray-500">{user?.name || "Not set"}</p>
          </div>

          <div>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1 cursor-pointer" onClick={openEditModal}>Profile information</button>
            <p className="text-sm text-gray-500">Edit your photo, name, pronouns, short bio, etc.</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1 cursor-pointer">Profile design</h2>
            <p className="text-sm text-gray-500">Customize the appearance of your profile.</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1">Custom domain</h2>
            <p className="text-sm text-gray-500">Upgrade to a Medium Membership to redirect to your own domain.</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1 cursor-pointer">Partner Program</h2>
            <p className="text-sm text-gray-500">You are not enrolled in the Partner Program.</p>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1 cursor-pointer">Muted writers and publications</h2>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-600 hover:text-gray-800 mb-1 cursor-pointer">Blocked users</h2>
          </div>

          <div>
            <button className="text-sm font-medium text-red-500 mb-1 cursor-pointer" onClick={confirmDeleteAccount}>Delete account</button>
            <p className="text-xs text-gray-500">Permanently delete your account and all of your content.</p>
          </div>
        </div>
      </main>

      {/* Profile Information Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-400/50 z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">Profile information</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium mb-2">Photo</h3>
              <div className="flex items-center gap-4">
                <div className="w-15 h-14 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="flex gap-2">
                    <button className="text-green-600 text-sm font-medium cursor-pointer">Update</button>
                    <button className="text-red-600 text-sm font-medium cursor-pointer">Remove</button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</p>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium">Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                placeholder="Your name"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${name.length > 50 ? 'text-red-500' : 'text-gray-500'}`}>{name.length}/50</span>
              </div>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium">Short bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mt-1 h-24"
                placeholder="Tell us a bit about yourself..."
              ></textarea>
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${bio.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>{bio.length}/160</span>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm cursor-pointer" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-400/50 z-50">
          <div className="bg-white rounded-md w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Delete Account</h2>
              <button onClick={() => setShowDeleteConfirmation(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-medium text-red-800">Warning: This action cannot be undone</h3>
                </div>
                <p className="text-sm text-red-700">
                  Deleting your account will permanently remove all your data including:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-red-700 ml-2">
                  <li>All your posts and comments</li>
                  <li>Your profile information</li>
                  <li>Your reading history and preferences</li>
                  <li>Followers and following relationships</li>
                </ul>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Please type <strong>delete my account</strong> below to confirm:
              </p>
              
              <input
                type="text"
                className="w-full border border-gray-300 rounded p-2 mb-4"
                placeholder="Type 'delete my account'"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
              
              {deleteError && (
                <div className="text-red-500 text-sm mb-4">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-full text-sm cursor-pointer" 
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium ${
                  isDeleting || deleteConfirmText !== 'delete my account' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={deleteAccount}
                disabled={isDeleting || deleteConfirmText !== 'delete my account'}
              >
                {isDeleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;