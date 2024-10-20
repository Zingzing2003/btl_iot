import connection from "../database.js";

export const changeTimezone = (datStr) => {
  // Từ múi giờ GMT+7 chuyển về UTC
  // Datestring ở dạng DD/MM/YYYY
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Kiểm tra định dạng ngày
  if (!dateRegex.test(datStr)) {
    return null;
  }
  
  const dateParts = datStr.split("/");
  const dateObject = new Date(
    +dateParts[2],
    dateParts[1] - 1,
    +dateParts[0]+1
  );

  console.log(dateObject);
  return dateObject.toISOString(); // Chuyển đổi sang định dạng UTC
};

// Lấy lịch sử hành động, có phân trang, tìm kiếm theo ngày
export const GetHistoryAction = async (req, res) => {
  try {
    // Page, limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Ngày ở dạng DD/MM/YYYY và múi giờ GMT+7
    let date = req.query.date?.trim() || null;
    let formattedUTCDate = null;

    //console.log(date);
    if (date) {
      // Chuyển về dạng UTC
      formattedUTCDate = changeTimezone(date);
    }

    console.log(formattedUTCDate)
    const Device = req.query.Device;
    
    // Query object
    let sql = "SELECT * FROM actions WHERE 1=1"; 
    const query = [];

    // if (Device === "all") {
    //     // Tìm kiếm trong các trường Temperature, Humidity, và Light
    //     sql += " AND (Temperature = ? OR Humidity = ? OR Light = ?)";
    //     query.push(parseFloat(keyword), parseFloat(keyword), parseFloat(keyword));


    if (["Air", "Led", "Fan"].includes(Device)) {
      sql += " AND Device =?";
      
      query.push(Device);
    }
    
    if (formattedUTCDate) {
      sql += " AND DATE(TimeAction) = DATE(?)";
      query.push(formattedUTCDate);
    }

    
    // Phân trang
    sql += " ORDER BY TimeAction DESC LIMIT ? OFFSET ?";
    query.push(limit, (page - 1) * limit);

    // Kết nối tới cơ sở dữ liệu và thực thi câu lệnh SQL
    const [data] = await connection.query(sql, query);
    console.log(sql);
    console.log(query);

    const countQuery = [];
    // Đếm tổng số bản ghi
    if (["Air", "Led", "Fan"].includes(Device)){
           countQuery.push(Device);
            var countSql = "SELECT COUNT(*) as total FROM actions WHERE 1=1" + (Device ? " AND Device = ?" : "") + (formattedUTCDate ? " AND DATE(TimeAction) = DATE(?)" : "");
        }
        else{

          var countSql = "SELECT COUNT(*) as total FROM actions WHERE 1=1" +(formattedUTCDate ? " AND DATE(TimeAction) = DATE(?)" : "");
        }
 
    
    
    if (formattedUTCDate) {
      countQuery.push(formattedUTCDate);
    }
    console.log(countSql);
    console.log(countQuery);
    const [totalRows] = await connection.query(countSql, countQuery);
    const totalActions = totalRows[0].total;

    // Trả về kết quả
    res.status(200).json({
        errorMessage: "Oke",
       totalActions,
        totalPages: Math.ceil(totalActions / limit),
        currentPage: page,
        data,
    });
    // const [data] = await connection.query("SELECT * FROM actions");
    // res.status(200).json({
    //     errorMessage: "Oke",
    //     data
    // });

  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "Server error" });
  }
};
