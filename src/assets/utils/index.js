export const parseTime = (t) => {
    const now = new Date(),
      old = new Date(t),
      now_year = now.getFullYear(),
      old_year = old.getFullYear(),
      now_month = now.getMonth() + 1,
      old_month = old.getMonth() + 1,
      now_date = now.getDate(),
      old_date = old.getDate(),
      format_month = old_month.toString().padStart(2, '0'),
      format_date = old_date.toString().padStart(2, '0'),
      format_minutes = old
        .getMinutes()
        .toString()
        .padStart(2, '0'),
      dayArr = [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ];
    if (now_year === old_year) {
      if (now_month === old_month && now_date - old_date < 7) {
        if (now_date === old_date) {
          return `${old.getHours()}:${format_minutes}`;
        } else if (now_date === old_date + 1) {
          return '昨天';
        } else if (now_date === old_date + 2) {
          return '前天';
        } else {
          return dayArr[old.getDay()];
        }
      } else {
        return `${format_month}-${format_date}`;
      }
    } else {
      return `${old_year}-${format_month}-${format_date}`;
    }
  };

