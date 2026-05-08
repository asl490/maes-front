import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEchartsCore } from 'ngx-echarts';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  Zap, LayoutDashboard, TrendingUp, Users, Settings, Bell, Search,
  Moon, Sun, Monitor, ChevronLeft, ChevronRight, ChevronDown,
  X, Menu, LogOut, User, CreditCard, Eye, EyeOff, Pencil, Trash2,
  Plus, Download, Check, AlertTriangle, Shield, Lock, Palette,
  Mail, KeyRound, ArrowRight, RefreshCw, UserPlus,
} from 'lucide-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideEchartsCore({ echarts: () => import('echarts') }),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        Zap, LayoutDashboard, TrendingUp, Users, Settings, Bell, Search,
        Moon, Sun, Monitor, ChevronLeft, ChevronRight, ChevronDown,
        X, Menu, LogOut, User, CreditCard, Eye, EyeOff, Pencil, Trash2,
        Plus, Download, Check, AlertTriangle, Shield, Lock, Palette,
        Mail, KeyRound, ArrowRight, RefreshCw, UserPlus,
      }),
    },
  ],
};
