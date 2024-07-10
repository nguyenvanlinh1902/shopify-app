import { presentDataAndFormatDate, presentDataFromDoc } from '@avada/firestore-utils';
import { Firestore } from '@google-cloud/firestore';
import Shopify from 'shopify-api-node';

const firestore = new Firestore();
/** @type CollectionReference */
const notificationRef = firestore.collection('notifications');

/**
 * Get shop notifications by given shop ID
 *
 * @param {string} id
 * @param {Object} options
 * @param {number} options.limit
 * @param {number} options.page
 * @param {string} options.searchKey
 * @param {string} options.sort
 * @return {Promise<FirebaseFirestore.DocumentData>}
 */
export async function getNotificationsByShopId(
  id,
  { limit = 30, page = 1, searchKey = '', sort = 'timestamp:desc' } = {}
) {
  try {
    const [sortField, sortOrder] = sort.split(':');
    let query = notificationRef.where('shopId', '==', id);
    if (searchKey) {
      query = query.where('searchKeyField', '==', searchKey); // Replace 'searchKeyField' with the actual field name
    }

    // Sorting and paginating
    query = query.orderBy(sortField, sortOrder)
      .limit(limit)
      .offset((page - 1) * limit);

    const docs = await query.get();

    const countQuery = await notificationRef.where('shopId', '==', id).count().get();
    const totalPage = Math.ceil(countQuery.data().count / limit);
    // thêm phần sử lí page sau nay neu co
    const pageInfo = { hasPre: page > 1, hasNext: page < totalPage };
    if (docs.empty) {
      return null;
    }

    return {
      notifications: docs.docs.map(doc => presentDataFromDoc(doc)),
      pageInfo,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Create default notifications
 *
 * @param {Object[]} data
 * @return {Promise<boolean>}
 */
export async function createNotifications(data) {
  const batch = firestore.batch();
  try {
    data.forEach(item => {
      const docRef = notificationRef.doc();
      batch.set(docRef, item);
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Create new notification
 *
 * @param {Object} data
 * @return {Promise<boolean>}
 */
export async function createNewNotification(data) {
  try {
    await notificationRef.doc().set(data);
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
