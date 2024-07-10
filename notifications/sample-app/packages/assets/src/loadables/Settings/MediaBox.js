import Loadable from 'react-loadable';
import Loading from '@assets/components/MediaCard/MediaBox';

export default Loadable({
  loader: () => import('../../components/MediaCard/MediaBox'),
  loading: Loading
});
