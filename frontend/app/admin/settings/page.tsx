'use client';

import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Users, 
  Database, 
  Key, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const FuturisticCard = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`
    relative group
    backdrop-blur-md bg-white/5 border border-white/10
    rounded-2xl p-6 
    transition-all duration-500 ease-out
    shadow-xl
    before:absolute before:inset-0 before:rounded-2xl 
    before:bg-gradient-to-r before:from-cyan-500/10 before:to-purple-500/10
    before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
    ${className}
  `}>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: 'PropChain',
    maintenanceMode: false,
    registrationOpen: true,
    
    // Security Settings
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    twoFactorRequired: false,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Property Settings
    autoApproval: false,
    minPropertyValue: 10000,
    maxTokensPerProperty: 10000,
    
    // AI Settings
    aiAnalysisEnabled: true,
    riskThreshold: 70,
    autoRejectHighRisk: false
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real implementation, this would save to backend
    console.log('Saving settings:', settings);
    
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        platformName: 'PropChain',
        maintenanceMode: false,
        registrationOpen: true,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        twoFactorRequired: false,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        autoApproval: false,
        minPropertyValue: 10000,
        maxTokensPerProperty: 10000,
        aiAnalysisEnabled: true,
        riskThreshold: 70,
        autoRejectHighRisk: false
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-cyan-400" />
            System Settings
          </h1>
          <p className="text-gray-400 mt-2">
            Configure platform settings and security options
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Platform Settings */}
        <FuturisticCard>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Platform Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleSettingChange('platformName', e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Maintenance Mode
                </label>
                <p className="text-xs text-gray-400">Temporarily disable platform access</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Open Registration
                </label>
                <p className="text-xs text-gray-400">Allow new user registrations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationOpen}
                  onChange={(e) => handleSettingChange('registrationOpen', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </FuturisticCard>

        {/* Security Settings */}
        <FuturisticCard>
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Security Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Session Timeout (hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Two-Factor Authentication Required
                </label>
                <p className="text-xs text-gray-400">Require 2FA for all admin accounts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactorRequired}
                  onChange={(e) => handleSettingChange('twoFactorRequired', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </FuturisticCard>

        {/* Notification Settings */}
        <FuturisticCard>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Email Notifications
                </label>
                <p className="text-xs text-gray-400">Send email alerts for important events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  SMS Notifications
                </label>
                <p className="text-xs text-gray-400">Send SMS alerts for critical events</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Push Notifications
                </label>
                <p className="text-xs text-gray-400">Browser push notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </FuturisticCard>

        {/* Property & AI Settings */}
        <FuturisticCard>
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Property & AI Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Minimum Property Value ($)
              </label>
              <input
                type="number"
                min="1000"
                value={settings.minPropertyValue}
                onChange={(e) => handleSettingChange('minPropertyValue', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                AI Risk Threshold (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.riskThreshold}
                onChange={(e) => handleSettingChange('riskThreshold', parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Low Risk</span>
                <span>{settings.riskThreshold}%</span>
                <span>High Risk</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  AI Analysis Enabled
                </label>
                <p className="text-xs text-gray-400">Use AI for property risk assessment</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aiAnalysisEnabled}
                  onChange={(e) => handleSettingChange('aiAnalysisEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>
          </div>
        </FuturisticCard>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="fixed bottom-8 right-8 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
