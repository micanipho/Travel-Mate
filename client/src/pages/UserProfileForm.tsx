import { useState } from 'react';

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
};

interface Props {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const UserProfileForm = ({ user, onSave, onCancel }: Props) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="space-y-4 p-2" onSubmit={handleSubmit}>
      {Object.entries(formData).map(([key, value]) => (
        <div key={key}>
          <label htmlFor={key} className="block text-1xl font-medium text-primary capitalize">
            {key.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            id={key}
            name={key}
            value={value}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
          />
        </div>
      ))}
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="submit"
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-primary font-semibold py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserProfileForm;
