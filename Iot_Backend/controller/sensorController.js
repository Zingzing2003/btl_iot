import connection from "../database.js"; 

const changeTimezone = (datStr) => {
  // Từ múi giờ GMT+7 chuyển về UTC
  // Datestring ở dạng DD/MM/YYYY HH:mm:ss
  const dateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;
  if (!dateRegex.test(datStr)) {
    return null;
  }
  const date = datStr.split(" ")[0];
  const time = datStr.split(" ")[1];
  const dateParts = date.split("/");
  const timeParts = time.split(":");
  const dateObject = new Date(
    +dateParts[2],
    dateParts[1] - 1,
    +dateParts[0],
    +timeParts[0],
    +timeParts[1],
    +timeParts[2]
  );
  return dateObject.toISOString(); // Chuyển đổi sang định dạng UTC
};

export const getAllSensors = async (req, res) => {
  try {
    // Page, limit
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query object
    const query = [];
    let sql = "SELECT * FROM sensors WHERE 1=1"; // Câu lệnh SQL cơ bản

    const keyword = req.query.keyword;
    const searchBy = req.query.searchBy;

   
    if (keyword) {
      //console.log( req.query.keyword);
      if (searchBy === "all") {
        console.log(searchBy);
        // Tìm kiếm trong các trường Temperature, Humidity, và Light
        sql += " AND (ROUND(Temperature,5) = ROUND(?,5) OR ROUND(Humidity,5) = ROUND(?,5) OR ROUND(Light,5) = ROUND(?,5))";
        query.push(parseFloat(keyword), parseFloat(keyword), parseFloat(keyword));
      } else if (["Temperature", "Humidity", "Light"].includes(searchBy)) {
        // Tìm kiếm trong trường cụ thể
        const value = parseFloat(keyword);
        if (!isNaN(value)) {
          sql += ` AND ${searchBy} = ?`;
          query.push(value);
        } else {
          // Xử lý trường hợp không phải số hợp lệ
          return res.status(400).json({ error: "Invalid keyword." });
        }
      } else {
        return res.status(400).json({
          error: "Invalid searchBy parameter. Use 'Temperature', 'Humidity', 'Light', or 'all'.",
        });
      }
    }

    // Thêm phân trang
    sql += " ORDER BY TimeSensor DESC LIMIT ? OFFSET ?";
    query.push(limit, skip);

    console.log(sql);
    console.log(query);
    // Thực thi câu lệnh SQL
    const [sensors] = await connection.query(sql, query);

    // Đếm tổng số bản ghi
    // const countSql = "SELECT COUNT(*) as total FROM sensors WHERE 1=1" ;//+ sql.slice(sql.indexOf(" WHERE"));
    // const [totalRows] = await connection.query(countSql, query);
    // const total = totalRows[0].total;
    const countQuery=[];
    if (searchBy === "all") {
      var  countSql = "SELECT COUNT(*) as total FROM sensors WHERE 1=1 AND (ROUND(Temperature,5) = ROUND(?,5) OR ROUND(Humidity,5) = ROUND(?,5) OR ROUND(Light,5) = ROUND(?,5))";
      countQuery.push(parseFloat(keyword), parseFloat(keyword), parseFloat(keyword));
    } else if (["Temperature", "Humidity", "Light"].includes(searchBy)) {
      // Tìm kiếm trong trường cụ thể
      var  countSql ="SELECT COUNT(*) as total FROM sensors WHERE 1=1";
      const value = parseFloat(keyword);
      if (!isNaN(value)) {
        countSql += ` AND ${searchBy} = ?`;
        countQuery.push(value);
      } else {
        // Xử lý trường hợp không phải số hợp lệ
        return res.status(400).json({ error: "Invalid keyword." });
      }
    } 
    const [totalRows] = await connection.query(countSql, countQuery);
    const total = totalRows[0].total;
    // Trả về kết quả với thông tin phân trang
    res.status(200).json({
        errorMessage: "Oke",
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
        data: sensors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "Server error" });
  }
};
export const GetTopSensors= async (req, res)=>{
  try{
    // Query để lấy 10 sensor gần nhất (giả sử bảng sensor có cột 'date')
    const [sensors] = await connection.query('SELECT * FROM sensors ORDER BY TimeSensor DESC LIMIT 10');
    res.status(200).json({
      errorMessage: "Oke",
      data: sensors
    });

  }catch( e){
    res.status(500).json({ errorMessage: "Server error" });
  }
}
