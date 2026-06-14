import supabase from '../db.js';

/**
 * Lấy danh sách từ vựng (Lesson Items) từ bảng `lesson_items`
 * @returns {Promise<Array>} Danh sách từ vựng
 */
export async function getLessonItems() {
  try {
    const { data, error } = await supabase
      .from('lesson_items')
      .select('*');

    if (error) {
      console.error('Lỗi khi lấy từ vựng:', error.message);
      return [];
    }

    return data;
  } catch (err) {
    console.error('Lỗi hệ thống:', err);
    return [];
  }
}

/**
 * Thêm một từ vựng mới vào bảng `lesson_items`
 * @param {Object} item - Ví dụ: { hiragana: 'あ', romaji: 'a', example: 'あめ', meaning: 'mưa', audio: '🐰' }
 * @returns {Promise<Object>} Dữ liệu vừa được thêm
 */
export async function addLessonItem(item) {
  try {
    const { data, error } = await supabase
      .from('lesson_items')
      .insert([item])
      .select(); // select() để trả về dòng dữ liệu vừa thêm

    if (error) {
      console.error('Lỗi khi thêm từ vựng:', error.message);
      return null;
    }

    console.log('Thêm thành công:', data);
    return data[0];
  } catch (err) {
    console.error('Lỗi hệ thống:', err);
    return null;
  }
}

/**
 * Xóa một từ vựng dựa vào ID
 * @param {Number|String} id 
 */
export async function deleteLessonItem(id) {
  try {
    const { error } = await supabase
      .from('lesson_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Lỗi khi xóa từ vựng:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Lỗi hệ thống:', err);
    return false;
  }
}
