export interface Employee {
    url: string,
    employee_id : number,    
    first_name : string,
    last_name : string
    salary : number
    date_join : Date
    on_field : boolean
    [key: string]: any; 
}
