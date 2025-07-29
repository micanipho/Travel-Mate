import { useState } from 'react';
import UserProfileView from './UserProfileView';
import UserProfileForm from './UserProfileForm';

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    country: 'USA',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updatedUser: typeof user) => {
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="flex items-center justify-center container p-10 mx-auto px-4">
        <div className="flex justify-center overflow-hidden w-[40vw] h-[80vh] bg-gradient-to-r from-pink-200 to-blue-200 rounded-3xl p-10 md:p-2">
          <div className="max-w-3xl mx-auto w-full">
            <h2 className="font-fredoka text-3xl mb-6 text-primary pl-6">My Profile</h2>
            {isEditing ? (
              <UserProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
            ) : (
              <UserProfileView user={user} onEdit={() => setIsEditing(true)} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
