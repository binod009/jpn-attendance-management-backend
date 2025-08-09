import { QueryTypes } from "sequelize";
import sequelize from "../config/database";

import { EmployeeLeaveSummary } from "../models";
import { calculateRemainingLeaveDays } from "../utils/helper";

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

type TCreateLeaveBalance = {
  body: {
    employee_id: number;
  };
};
interface UserJoinedDataResult {
  joined_date: Date;
}
type LeaveDaysResult = {
  employee_id: number;
  total_leave_days_sum: string; // or number if you cast in SQL
};
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
  createLeaveSummary = async ({ body }: TCreateLeaveBalance): Promise<boolean> => {
    const { employee_id } = body;

    try {
      // 1. Fetch the user's joined_date (read-only, no transaction needed)
      const userJoinedDateResult = await sequelize.query<UserJoinedDataResult>(
        `SELECT joined_date FROM users WHERE id = :id`,
        {
          replacements: { id: employee_id },
          type: QueryTypes.SELECT,
        }
      );

      const joinedDate = userJoinedDateResult[0]?.joined_date;
      if (!joinedDate) {
        throw new Error(`User with id ${employee_id} does not have a joined_date.`);
      }

      // 2. Calculate total leave days (assumed to be a separate DB call or business logic)
      const totalLeaveDays = await this.employee_total_leave_days({ body: { id: employee_id } });

      // 3. Check if leave summary record already exists for this employee and current year
      const currentYear = new Date().getFullYear();
      const leaveSummary = await EmployeeLeaveSummary.findOne({
        where: {
          employee_id,
          year: currentYear,
        },
      });

      // 4. Create or update leave summary accordingly
      if (!leaveSummary) {
        await EmployeeLeaveSummary.create({
          employee_id,
          year: currentYear,
          total_allowed_days: calculateRemainingLeaveDays(joinedDate),
          days_taken: totalLeaveDays ?? 0,
        });
      } else {
        await EmployeeLeaveSummary.update(
          { days_taken: totalLeaveDays ?? 0 },
          { where: { employee_id, year: currentYear } }
        );
      }

      // 5. Return success flag
      return true;
    } catch (error) {
      console.error("Error creating/updating leave summary:", error);
      // Return false on failure, or re-throw error if you want upstream handling
      return false;
    }

  }

  employee_total_leave_days = async ({
  body,
}: {
  body: {
    id: number;
  };
}) => {
  const { id } = body;
  const sql_query = `
  SELECT employee_id,
  SUM(total_leave_days) as total_leave_days_sum
  FROM leave_requests
  WHERE employee_id = :employee_id
  GROUP BY employee_id
  `;

  const total_leave_days = await sequelize.query<LeaveDaysResult>(sql_query, {
    replacements: {
      employee_id: id,
    },
    type: QueryTypes.SELECT,
  });
  return parseInt(total_leave_days[0].total_leave_days_sum, 10);
};
}




export default new LeaveServices();
