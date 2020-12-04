import User, { IUser } from '@entities/User';
import MsSql from 'mssql';



export interface IUserDao {
    getOne: (email: string) => Promise<IUser | null>;
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

class UserDao implements IUserDao {

    private pool: MsSql.ConnectionPool;
    private connected: boolean = false;


    constructor(){
        this.pool = new MsSql.ConnectionPool({
            user: process.env?.MSSQL_USER,
            database: process.env?.MSSQL_DB || "",
            password: process.env?.MSSQL_PW,
            server: process.env?.MSSQL_SERVER || "",
            port: Number(process.env?.MSSQL_PORT),
            pool: {
                autostart: true
            }
        });
    }


    /**
     * @param email
     */
    public getOne(email: string): Promise<IUser | null> {
        
        
        return this.pool.connect().then((_pool)=>{
            
            // SELECT * FROM [hero_db].[dbo].[heroes] WHERE hero_mail 
            return _pool.query`USE [hero_db];
            SELECT * FROM [heroes] WHERE hero_mail = ${email}`
            .then((res:any)=>{
                console.log("Result: ", res);
                var user = new User(
                    res?.hero_alias || "", 
                    res?.hero_mail || "", 
                    res?.hero_id || undefined
                );
                return Promise.resolve(user);
            },(err)=>{
                return Promise.reject(err);
            });

        },(err)=>{
            return Promise.reject("DB not connected.");
        })



    }


    /**
     *
     */
    public getAll(): Promise<IUser[]> {

        console.log("Called getAll().");
        return this.pool.connect().then((_pool)=>{
            
            console.log("DB is connected.");
            // SELECT * FROM [hero_db].[dbo].[heroes] WHERE hero_mail 
        
            return this.pool.query`USE [hero_db];
                SELECT * FROM [heroes];`
                .then((res:any)=>{
                    console.log("Result: ", res);
                    var users: User[] = res.recordset.map((user_row:any,idx:number) => {
                        return new User(
                            user_row?.hero_alias || "", 
                            user_row?.hero_mail || "", 
                            user_row?.hero_id || undefined
                        );
                    });
                    console.log("Users: ", users);
                    return Promise.resolve(users);
                },(err)=>{
                    return Promise.reject(err);
                }).catch((err)=>{
                    return Promise.reject(err);
                });
            
        },(err)=>{
            return Promise.reject("DB not connected.");
        })

    }


    /**
     *
     * @param user
     */
    public async add(user: IUser): Promise<void> {
         // TODO
        return Promise.resolve(undefined);
    }


    /**
     *
     * @param user
     */
    public async update(user: IUser): Promise<void> {
         // TODO
        return Promise.resolve(undefined);
    }


    /**
     *
     * @param id
     */
    public async delete(id: number): Promise<void> {
         // TODO
        return Promise.resolve(undefined);
    }
}

export default UserDao;
