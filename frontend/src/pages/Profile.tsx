import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { useUser } from "../hooks";
import { BACKEND_URL } from "../config";
import axios from "axios";

const Profile = () => {
  const {user} = useUser();
  console.log("user",user);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const handleEditProfile = () => {
    setIsEditProfile(!isEditProfile);
  }
  const handleSaveProfile = () => {
    axios.put(`${BACKEND_URL}/api/v1/user/profile`, {
      bio,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((res) => {
        setIsEditProfile(false);
      console.log("res",res);
    })
    .catch((err) => {
      console.log("err",err);
    })
  }
  return (
    <div>
        <Appbar />
        <div className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-[12%]">
                <div className="col-span-8 bg-gray-100 p-4 rounded-lg">
                    <h1 className="text-2xl font-bold">{user?.name}</h1>
                    <p className="text-gray-500">{user?.bio}</p>
                </div>
                <div className="col-span-4 p-4 rounded-lg bg-gray-100">
                    {isEditProfile ? <EditProfile bio={bio} setBio={setBio} handleSaveProfile={handleSaveProfile} /> : (
                    <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <img src={ "./src/assets/default_image.png"} alt="Profile" className="w-10 h-10 rounded-full bg-gray-300 p-1" />
                            <div className="flex flex-col gap-2 justify-center items-center">
                                <h1 className="text-2xl font-bold">{user?.name}</h1>
                                <p className="text-gray-500">{user?.bio}</p>
                            </div>
                            <button className="cursor-pointer rounded-lg text-green-400" onClick={handleEditProfile}>Edit Profile</button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}


const EditProfile = ({ bio, setBio, handleSaveProfile}: {bio: string, setBio: (bio: string) => void, handleSaveProfile: () => void}) => {
    return <div className="flex flex-col gap-4 justify-center items-center">
            <h1>Edit Profile</h1>
            <input type="text" placeholder="Bio" className="w-full p-2 rounded-lg bg-gray-200 focus:outline-none" value={bio} onChange={(e) => setBio(e.target.value)} />
            <button className="cursor-pointer rounded-lg text-green-400" onClick={handleSaveProfile}>Save</button>
        </div>
}

export default Profile