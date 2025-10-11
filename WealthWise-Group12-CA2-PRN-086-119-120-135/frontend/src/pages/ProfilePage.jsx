import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Target,
  Edit3,
  Save,
  X,
  Calendar,
  MapPin,
  Building2,
  Heart,
  Mail,
  Users,
  Camera,
  Settings,
  Link,
  Shield,
  Bell,
  Trash2,
  LogOut,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { zerodhaService } from "../services/zerodhaService";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [zerodhaStatus, setZerodhaStatus] = useState({
    connected: false,
    profile: null,
    loading: true,
    error: null
  });

  // Hash navigation effect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const validTabs = ["personal", "employment", "retirement", "settings"];
      if (hash && validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  useEffect(() => {
    checkZerodhaConnectionStatus();
  }, []);

  const checkZerodhaConnectionStatus = async () => {
    try {
      setZerodhaStatus(prev => ({ ...prev, loading: true }));
      const status = await zerodhaService.checkConnectionStatus();
      setZerodhaStatus({
        connected: status.connected,
        profile: status.profile,
        loading: false,
        error: status.error || null
      });
    } catch (error) {
      setZerodhaStatus({
        connected: false,
        profile: null,
        loading: false,
        error: error.message
      });
    }
  };

  const handleZerodhaConnect = async () => {
  try {
    setZerodhaStatus({ loading: true, error: null });
    // Pass current URL (settings page) as return URL for callback redirect
    const currentUrl = '/profile#settings';
    const loginUrl = await zerodhaService.getLoginUrl(currentUrl);
    
    // Redirect to Zerodha login instead of opening popup
    window.location.href = loginUrl;
    
  } catch (error) {
    setZerodhaStatus({ 
      loading: false, 
      error: error.message 
    });
  }
};

  const handleZerodhaDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect your Zerodha account?')) {
      try {
        setZerodhaStatus(prev => ({ ...prev, loading: true }));
        await zerodhaService.disconnect();
        setZerodhaStatus({
          connected: false,
          profile: null,
          loading: false,
          error: null
        });
      } catch (error) {
        setZerodhaStatus(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message 
        }));
      }
    }
  };
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketAlerts: true,
    twoFactorAuth: false,
    dataVisibility: "private",
  });
  
  const [profile, setProfile] = useState({
    fullName: user?.name ?? "Not Provided",
    email: user?.email ?? "Not Provided",
    dob: user?.birthday ?? "01-01-1970",
    gender: user?.gender ?? "Prefer not to say",
    location: "India",
    employmentStatus: "Software Developer",
    company: "Augrade",
    yearsOfService: 5,
    retirementAge: 60,
    spouseName: "",
    goal: "Maintain lifestyle and leave legacy",
    profilePicUrl: user?.profile_picture ?? "/profile-default.png"
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSettingChange = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  const handleSave = () => {
    setEditing(false);
    console.log("Saved profile:", profile);
  };

  const handleLinkZerodha = () => {
    // This function is no longer needed as we're using the new Zerodha integration
    if (zerodhaStatus.connected) {
      handleZerodhaDisconnect();
    } else {
      handleZerodhaConnect();
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleDeleteAccount = () => {
    console.log("Deleting account...");
    setShowDeleteConfirm(false);
  };

  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(profile.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const yearsToRetirement = profile.retirementAge - calculateAge();

  const tabs = [
    { id: "personal", label: "Personal", icon: User },
    { id: "employment", label: "Employment", icon: Briefcase },
    { id: "retirement", label: "Retirement", icon: Target },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const Field = ({ label, name, type = "text", options, className = "" }) => (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {editing ? (
        options ? (
          <select
            name={name}
            value={profile[name]}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white shadow-sm transition-all"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={profile[name]}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all"
          />
        )
      ) : (
        <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 font-medium">
          {profile[name] || (
            <span className="text-slate-400 italic">Not provided</span>
          )}
        </div>
      )}
    </div>
  );

  const StatItem = ({ label, value, color = "text-slate-700" }) => (
    <div className="text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  );

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex-1">
        <h4 className="font-medium text-slate-900">{label}</h4>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  const PersonalTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Full Name" name="fullName" />
        <Field label="Email" name="email" type="email" />
        <Field label="Date of Birth" name="dob" type="date" />
        <Field
          label="Gender"
          name="gender"
          options={["Male", "Female", "Other", "Prefer not to say"]}
        />
        <Field label="Location" name="location" />
        <Field label="Spouse Name" name="spouseName" />
      </div>

              <div className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 border border-primary/20 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-slate-800 text-lg">
            Personal Summary
          </h4>
        </div>
        <p className="text-slate-600 leading-relaxed">
          {profile.fullName} is a {calculateAge()}-year-old{" "}
          {profile.employmentStatus} based in {profile.location}.
          {profile.spouseName && ` Married to ${profile.spouseName}.`}
        </p>
      </div>
    </div>
  );

  const EmploymentTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Employment Status" name="employmentStatus" />
        <Field label="Company" name="company" />
        <Field
          label="Years of Service"
          name="yearsOfService"
          type="number"
          className="md:col-span-2"
        />
      </div>

      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-slate-800 text-lg">
            Career Overview
          </h4>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Currently working as a {profile.employmentStatus} at {profile.company}{" "}
          with {profile.yearsOfService} years of professional experience in the
          industry.
        </p>
      </div>
    </div>
  );

  const RetirementTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Target Retirement Age"
          name="retirementAge"
          type="number"
        />
        <Field label="Retirement Goal" name="goal" />
      </div>

      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <h4 className="font-semibold text-slate-800 text-lg">
            Retirement Planning
          </h4>
        </div>
        <p className="text-slate-600 leading-relaxed">
          Planning to retire at age {profile.retirementAge}, which is{" "}
          {yearsToRetirement} years from now. Primary goal: {profile.goal}.
        </p>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-8">
      {/* Account Integrations */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Account Integrations
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${zerodhaStatus.connected ? 'bg-success-600' : 'bg-primary'} rounded-lg flex items-center justify-center`}>
                  <ExternalLink className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-slate-900">Zerodha</h4>
                    <div className={`w-2 h-2 rounded-full ${zerodhaStatus.connected ? 'bg-success-500' : 'bg-red-500'}`}></div>
                  </div>
                  {zerodhaStatus.loading ? (
                    <p className="text-sm text-slate-600">Checking connection...</p>
                  ) : zerodhaStatus.connected && zerodhaStatus.profile ? (
                    <div>
                      <p className="text-sm text-success-600 font-medium">Connected</p>
                      <p className="text-xs text-slate-600">{zerodhaStatus.profile.user_name} ({zerodhaStatus.profile.user_id})</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">Connect your trading account</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {zerodhaStatus.connected && (
                  <button
                    onClick={checkZerodhaConnectionStatus}
                    disabled={zerodhaStatus.loading}
                    className="p-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
                    title="Refresh status"
                  >
                    <RefreshCw className={`w-4 h-4 ${zerodhaStatus.loading ? 'animate-spin' : ''}`} />
                  </button>
                )}
                <button
                  onClick={zerodhaStatus.connected ? handleZerodhaDisconnect : handleZerodhaConnect}
                  disabled={zerodhaStatus.loading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    zerodhaStatus.connected
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-primary text-white hover:bg-primary-600"
                  }`}
                >
                  {zerodhaStatus.loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>{zerodhaStatus.connected ? 'Disconnecting...' : 'Connecting...'}</span>
                    </div>
                  ) : (
                    zerodhaStatus.connected ? "Disconnect" : "Connect"
                  )}
                </button>
              </div>
            </div>
            {zerodhaStatus.error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{zerodhaStatus.error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.emailNotifications}
            onChange={() => handleSettingChange("emailNotifications")}
            label="Email Notifications"
            description="Receive updates and alerts via email"
          />
          <ToggleSwitch
            enabled={settings.pushNotifications}
            onChange={() => handleSettingChange("pushNotifications")}
            label="Push Notifications"
            description="Get real-time notifications on your device"
          />
          <ToggleSwitch
            enabled={settings.marketAlerts}
            onChange={() => handleSettingChange("marketAlerts")}
            label="Market Alerts"
            description="Notifications for market movements and opportunities"
          />
        </div>
      </div>

      {/* Security */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Security & Privacy
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={settings.twoFactorAuth}
            onChange={() => handleSettingChange("twoFactorAuth")}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
          />
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Profile Visibility</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Control who can see your profile information
                </p>
              </div>
              <select
                value={settings.dataVisibility}
                onChange={(e) => setSettings({...settings, dataVisibility: e.target.value})}
                className="px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Account Actions
        </h3>
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-200"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTab />;
      case "employment":
        return <EmploymentTab />;
      case "retirement":
        return <RetirementTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <PersonalTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover Photo with Pattern */}
      <div className="h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/profile-header-bg.jpg')] opacity-30"></div>
        {/* <div className="absolute top-4 right-4">
          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
            <Camera className="w-5 h-5" />
          </button>
        </div> */}
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-32 pb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-36 h-36 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl overflow-hidden flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-white">
                  <img 
                    src={profile.profilePicUrl} 
                    alt={`${profile.name}'s profile`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {profile.fullName}
                </h1>
                <p className="text-lg text-slate-600 mb-3">
                  {profile.employmentStatus} at {profile.company}
                </p>
                <div className="flex items-center justify-center lg:justify-start space-x-2 text-slate-500 mb-6">
                  <MapPin size={18} />
                  <span className="font-medium">{profile.location}</span>
                </div>

                {/* Stats */}
                <div className="flex justify-center lg:justify-start space-x-12">
                  <StatItem
                    label="Current Age"
                    value={`${calculateAge()}`}
                    color="text-primary"
                  />
                  <StatItem
                    label="Experience"
                    value={`${profile.yearsOfService} years`}
                    color="text-success-600"
                  />
                  <StatItem
                    label="To Retirement"
                    value={`${yearsToRetirement} years`}
                    color="text-purple-600"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {editing ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg font-semibold"
                    >
                      <Save size={18} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center space-x-2 px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors font-semibold"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors shadow-lg font-semibold"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-2">
            <nav className="flex space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-lg"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <p className="text-slate-500 text-sm">
            Last updated{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Account
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}