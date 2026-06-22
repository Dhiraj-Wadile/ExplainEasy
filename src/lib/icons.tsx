import {
  Brain, TrendingUp, BookOpen, Star, Lightbulb,
  BarChart3, Users, Target, Rocket, Coins,
  MessageCircle, Shield, PieChart, GraduationCap,
  Video, FileText, Cpu, Building2, Megaphone,
  Handshake, Layers, Briefcase, CircleDot, Zap,
  DollarSign, Search, ShoppingCart, Monitor, Car,
  Film, Home, Navigation, ShoppingBag, UtensilsCrossed,
  Globe, Activity, Smartphone, Fish,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const iconRegistry: Record<string, LucideIcon> = {
  Brain, TrendingUp, BookOpen, Star, Lightbulb,
  BarChart3, Users, Target, Rocket, Coins,
  MessageCircle, Shield, PieChart, GraduationCap,
  Video, FileText, Cpu, Building2, Megaphone,
  Handshake, Layers, Briefcase, CircleDot, Zap,
  DollarSign, Search, ShoppingCart, Monitor, Car,
  Film, Home, Navigation, ShoppingBag, UtensilsCrossed,
  Globe, Activity, Smartphone,
  Shark: Fish,
}

export function getIcon(name: string, fallback: LucideIcon = BookOpen): LucideIcon {
  return iconRegistry[name] || fallback
}
