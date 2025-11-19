import React from 'react';

export enum SectionId {
  INTRO = 'intro',
  ARCHITECTURE = 'architecture',
  TECHNOLOGY = 'technology',
  ECOSYSTEM = 'ecosystem',
  SCIENCE = 'science',
  TRUST = 'trust',
  INFRASTRUCTURE = 'infrastructure',
  MONETIZATION = 'monetization',
  TOKENOMICS = 'tokenomics',
  ROADMAP = 'roadmap',
  RISKS = 'risks'
}

export interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
}

export interface ROIChartData {
  month: string;
  revenue: number;
  costs: number;
  cumulativeProfit: number;
}

export type Language = 'en' | 'ru';