class SalaryServices {
  // calculate salary after deduction the amount from leave taken
  calculateSalaryDeductionByLeave(
    base_salary: number,
    total_leave: number
  ):IDeduction  {
    const deduction_salary = (base_salary / 30) * total_leave;
    const final_salary = base_salary - deduction_salary;
    return {final_salary,deduction_salary};
  }
}


interface IDeduction{
    final_salary: number;
    deduction_salary: number;
}
export default new SalaryServices();
