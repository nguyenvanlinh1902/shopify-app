import Loadable from 'react-loadable';
import Loading from '@assets/components/Loading';

export default Loadable({
  loader: () => import('../../pages/Settings/Settings'),
  loading: Loading
});
