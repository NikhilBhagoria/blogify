import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { useUser } from "../hooks";
import axios from "axios";
import { BACKEND_URL } from "../config";

const Profile = () => {
  const { user,setUser } = useUser();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Reset edit fields when opening modal
  const openEditModal = () => {
    // Reset form values to current user values when opening modal
    setName(user?.name || '');
    setBio(user?.bio || '');
    setError('');
    setShowModal(true);
  };


  // return (
  //   <div>
  //       <Appbar />
  //       <div className="pt-12">
  //           <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-[12%]">
  //               <div className="col-span-8 bg-gray-100 p-4 rounded-lg">
  //                   <h1 className="text-2xl font-bold">{user?.name}</h1>
  //                   <p className="text-gray-500">{user?.bio}</p>
  //               </div>
  //               <div className="col-span-4 p-4 rounded-lg bg-gray-100">
  //                   {isEditProfile ? <EditProfile bio={bio} setBio={setBio} handleSaveProfile={handleSaveProfile} /> : (
  //                   <div className="flex flex-col gap-4 justify-center items-center">
  //                       <div className="flex flex-col gap-2 justify-center items-center">
  //                           <img src={ "./src/assets/default_image.png"} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300 p-1" />
  //                           <div className="flex flex-col gap-2 justify-center items-center">
  //                               <h1 className="text-2xl font-bold">{user?.name}</h1>
  //                               <p className="text-gray-500">{user?.bio}</p>
  //                           </div>
  //                           <button className="cursor-pointer rounded-lg text-green-400" onClick={handleEditProfile}>Edit Profile</button>
  //                       </div>
  //                   </div>
  //                   )}
  //               </div>
  //           </div>
  //       </div>
  //   </div>
  // )


  const handleSaveProfile = async () => {
        // Clear previous errors
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
        // Update local user state if needed
        const updatedUser = response.data.user;
        setUser({
          ...user,
          name: updatedUser.name,
          bio: updatedUser.bio,
          email:user?.email || ''
        });
        setName(updatedUser.name);
        setBio(updatedUser.bio);
        setShowModal(false);
        // You might want to update the user context here
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      // Add error handling/notification here
    } finally {
      setIsLoading(false);
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
            <button className="text-sm font-medium text-red-500 mb-1 cursor-pointer">Delete account</button>
            <p className="text-xs text-gray-500">Permanently delete your account and all of your content.</p>
          </div>
        </div>
      </main>

      {/* Profile Information Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-gray-400/50">
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

            {/* <div className="mb-2">
              <label className="text-sm font-medium">Pronouns</label>
              <input 
                type="text" 
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 mt-1"
                placeholder="Add..."
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${pronouns.length > 4 ? 'text-red-500' : 'text-gray-500'}`}>{pronouns.length}/4</span>
              </div>
            </div> */}

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


            {/* <div className="mb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">About Page</h3>
                <button className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Personalize with images and more to paint more of a vivid portrait of yourself than your "Short bio".</p>
            </div> */}

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm cursor-pointer" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={handleSaveProfile}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



// const EditProfile = ({ bio, setBio, handleSaveProfile}: {bio: string, setBio: (bio: string) => void, handleSaveProfile: () => void}) => {
//     return <div className="flex flex-col gap-4 justify-center items-center">
//             <h1>Edit Profile</h1>
//             <input type="text" placeholder="Bio" className="w-full p-2 rounded-lg bg-gray-200 focus:outline-none" value={bio} onChange={(e) => setBio(e.target.value)} />
//             <button className="cursor-pointer rounded-lg text-green-400" onClick={handleSaveProfile}>Save</button>
//         </div>
// }

export default Profile