import {
  createElement, Home, Search, User, Plus, Trash2, Pencil, LogOut, Droplet,
  UserPlus, Mail, Phone, MapPin, Check, ChevronDown, Menu, Eye, EyeOff, LogIn,
} from "lucide";

const icons = { Home, Search, User, Plus, Trash2, Pencil, LogOut, Droplet, UserPlus, Mail, Phone, MapPin, Check, ChevronDown, Menu, Eye, EyeOff, LogIn };

export const icon = (name, props = {}) =>
  createElement(icons[name], { width: 18, height: 18, ...props }).outerHTML;