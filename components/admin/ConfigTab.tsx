import React, { useState } from 'react';
import { AppConfig } from '../../context/ConfigContext';

// Import Modular Settings Tabs
import { GlobalSettings } from './config_tabs/GlobalSettings';
import { HeroFormSettings } from './config_tabs/HeroFormSettings';
import { IntroSettings } from './config_tabs/IntroSettings';
import { GastronomySettings } from './config_tabs/GastronomySettings';
import { SpecialtiesSettings } from './config_tabs/SpecialtiesSettings';
import { PhilosophySettings } from './config_tabs/PhilosophySettings';
import { ContactSettings } from './config_tabs/ContactSettings';

interface ConfigTabProps {
    localConfig: AppConfig;
    setLocalConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
    userEmail: string;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ localConfig, setLocalConfig, userEmail }) => {
    const [activeSubTab, setActiveSubTab] = useState('global');

    const subTabs = [
        { id: 'global', label: 'Marca i Portada', icon: 'verified' },
        { id: 'hero_form', label: 'Formulari Hero', icon: 'calendar_month' },
        { id: 'intro', label: 'Intro', icon: 'edit_note' },
        { id: 'gastronomy', label: 'Gastronomia', icon: 'restaurant_menu' },
        { id: 'specialties', label: 'Especialitats', icon: 'stars' },
        { id: 'philosophy', label: 'Filosofia / Història', icon: 'spa' },
        { id: 'contact', label: 'Contacte', icon: 'contact_mail' },
    ];

    return (
        <div className="animate-[fadeIn_0.3s_ease-out] pb-32">
            
            {/* SUB-NAVIGATION BAR */}
            <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm border border-gray-200 sticky top-0 z-20">
                {subTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                            ${activeSubTab === tab.id 
                                ? 'bg-[#2c241b] text-white shadow-md transform scale-105' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* RENDER ACTIVE TAB */}
            <div className="space-y-8">
                {activeSubTab === 'global' && <GlobalSettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
                {activeSubTab === 'hero_form' && <HeroFormSettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
                {activeSubTab === 'intro' && <IntroSettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
                {activeSubTab === 'gastronomy' && <GastronomySettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
                {activeSubTab === 'specialties' && <SpecialtiesSettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
                {activeSubTab === 'philosophy' && <PhilosophySettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
                {activeSubTab === 'contact' && <ContactSettings localConfig={localConfig} setLocalConfig={setLocalConfig} />}
            </div>
        </div>
    );
};