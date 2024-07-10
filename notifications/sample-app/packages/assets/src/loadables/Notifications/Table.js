import Loadable from 'react-loadable';
import Loading from '@assets/components/Table/TableComponent';

export default Loadable({
  loader: () => import('../../components/Table/TableComponent'),
  loading: Loading
});
