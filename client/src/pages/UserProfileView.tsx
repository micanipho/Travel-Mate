type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
};

interface Props {
  user: User;
  onEdit: () => void;
}

const UserProfileView = ({ user, onEdit }: Props) => {
  return (
    <div className="space-y-4 p-2">
      {Object.entries(user).map(([key, value]) => (
        <div key={key}>
          <p className="block text-1xl font-medium text-primary capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
          <p className="mt-1 text-sm text-gray-700 bg-white px-3 py-2 border rounded-md">{value}</p>
        </div>
      ))}
      <div className="flex justify-end mt-6">
        <button
          onClick={onEdit}
          className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserProfileView;
