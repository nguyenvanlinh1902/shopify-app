import {HomeIcon, NotificationIcon, SettingsIcon} from '@shopify/polaris-icons';
import getUrl from '../helpers/getUrl';

const getNavigations = (location, history) => {
  const {pathname} = location;
  const navItems = [
    {
      label: 'Home',
      icon: HomeIcon,
      selected: pathname === getUrl('/') || pathname === getUrl(''),
      url: '/'
    },
    {
      label: 'Notifications',
      icon: NotificationIcon,
      selected: pathname === getUrl('/') || pathname === getUrl(''),
      url: '/notifications'
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      selected: pathname === getUrl('/') || pathname === getUrl(''),
      url: '/settings'
    }
  ].filter(Boolean);
  return navItems.map(item => ({...item, onClick: () => history.push(item.url)}));
};

export default getNavigations;
