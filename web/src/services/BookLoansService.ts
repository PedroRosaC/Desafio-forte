import { Api } from "./Api";

export async function getBookLoans(): Promise<any[]>{
    const {data} = await Api.get("/book-loans")
    return data
}