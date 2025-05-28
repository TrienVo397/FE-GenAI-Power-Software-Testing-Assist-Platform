import { useState } from "react";
import ProfileForm from "../components/profile/ProfileForm";
import ChangePasswordDialog from "../components/profile/ChangePasswordDialog";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleProfileSubmit = async (data) => {
    setProfile(data);
    console.log("Profile updated:", data);
  };

  const handlePasswordSubmit = async (data) => {
    console.log("Password updated:", data);
    setShowPasswordDialog(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <ProfileForm
        initialData={profile}
        onSubmit={handleProfileSubmit}
        onChangePassword={() => setShowPasswordDialog(true)}
      />

      {showPasswordDialog && (
        <ChangePasswordDialog
          onSubmit={handlePasswordSubmit}
          onClose={() => setShowPasswordDialog(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
