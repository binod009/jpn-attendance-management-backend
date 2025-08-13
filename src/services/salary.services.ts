class SalaryServices {
  // calculate salary after deduction the amount from leave taken
  calculateSalaryDeductionByLeave(
    base_salary: number,
    total_leave: number
  ): IDeduction {
    if (total_leave === 0) {
      return { deduction_salary: 0, final_salary: base_salary };
    }
    const deduction_salary = (base_salary / 30) * total_leave;
    console.log("salary deducted", deduction_salary);
    const final_salary = base_salary - deduction_salary;
    console.log("final salary", final_salary);
    return { final_salary, deduction_salary };
  }
}

interface IDeduction {
  final_salary: number;
  deduction_salary: number;
}
export default new SalaryServices();
