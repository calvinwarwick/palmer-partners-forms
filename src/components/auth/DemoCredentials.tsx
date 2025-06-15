
interface DemoCredentialsProps {
  onFillCredentials: () => void;
}

const DemoCredentials = ({ onFillCredentials }: DemoCredentialsProps) => {
  return (
    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
      <p className="text-sm font-medium text-orange-800 mb-3">Demo Account Access:</p>
      <button
        type="button"
        onClick={onFillCredentials}
        className="w-full text-left p-3 text-sm bg-white rounded-md border border-orange-200 hover:bg-orange-50 transition-colors shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">Admin User</div>
            <div className="text-gray-600 text-xs mt-1">admin@palmerandpartners.com</div>
            <div className="text-gray-500 text-xs mt-1">Password: admin123456</div>
          </div>
          <div className="text-orange-600 text-xs font-medium px-2 py-1 bg-orange-100 rounded">
            Click to fill
          </div>
        </div>
      </button>
      <p className="text-xs text-orange-700 mt-3 leading-relaxed">
        Click to auto-fill admin credentials and access the dashboard.
      </p>
    </div>
  );
};

export default DemoCredentials;
