import { QueryTypes } from "sequelize";
import sequelize from "../config/database";
import { off } from "process";

interface IGetLeaveService {
  params: {
    employee_id: number | null;
  };
  query: {
    status?: "pending" | "accepted" | "rejected";
    limit: number;
    offset: number;
  };
}

class LeaveServices {
  getLeaveListService = async ({ params, query }: IGetLeaveService) => {
    const { limit = 10, offset = 0, status } = query;
    const { employee_id } = params;
    const sql_query = `
        SELECT
        lr.id,
        lr.employee_id,
        lr.reason,
        lr.status,
        lr.leave_type,
        lr.start_date,
        lr.end_date,
        json_build_object(
        'id',u.id,
        'email',u.email,
        'role',u.role
        ) AS "employee_details",
  COUNT(*) OVER() AS total_count        
FROM leave_requests AS lr
LEFT JOIN users u on lr.employee_id = u.id
WHERE (:employee_id is NULL or lr.employee_id= :employee_id) AND (:status is NULL or lr.status =:status)
LIMIT :limit OFFSET :offset
        `;

    console.log("limit", limit);
    console.log("offset", offset);
    console.log("employeedid", employee_id);
    console.log("status", status);
    const leave_result = await sequelize.query(sql_query, {
      replacements: {
        limit: limit,
        offset: offset,
        status: status ?? null,
        employee_id: employee_id,
      },
      type: QueryTypes.SELECT,
    });
    return leave_result;
  };
}

export default new LeaveServices();
