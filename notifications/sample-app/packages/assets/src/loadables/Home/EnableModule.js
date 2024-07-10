import Loadable from 'react-loadable';
import Loading from '@assets/components/Enable/EnableModuleComponent';

export default Loadable({
  loader: () => import('../../components/Enable/EnableModuleComponent'),
  loading: Loading
});
