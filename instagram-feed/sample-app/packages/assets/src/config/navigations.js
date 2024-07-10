import {ConnectIcon, HomeIcon, LogoInstagramIcon, SettingsIcon} from '@shopify/polaris-icons';
import getUrl from '../helpers/getUrl';

const getNavigations = (location, history) => {
  const {pathname} = location;
  const navItems = [
    {
      label: 'Home',
      icon: HomeIcon,
      selected: pathname === getUrl('/') || pathname === getUrl(''),
      url: '/home'
    },
    {
      label: 'Main Feed',
      icon: LogoInstagramIcon,
      selected: pathname === getUrl('/') || pathname === getUrl(''),
      url: '/main-feed'
    }
  ].filter(Boolean);
  return navItems.map(item => ({...item, onClick: () => history.push(item.url)}));
};

export default getNavigations;
