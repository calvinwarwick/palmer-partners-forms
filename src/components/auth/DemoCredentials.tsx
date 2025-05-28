
interface DemoCredentialsProps {
  onFillCredentials: () => void;
}

const DemoCredentials = ({ onFillCredentials }: DemoCredentialsProps) => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-3">Demo Account:</p>
      <button
        type="button"
        onClick={onFillCredentials}
        className="w-full text-left p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
      >
        <strong>Demo User:</strong> demo.user@test.com / demo123456
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Click to auto-fill demo credentials. If the account doesn't exist, it will be created automatically.
      </p>
    </div>
  );
};

export default DemoCredentials;
