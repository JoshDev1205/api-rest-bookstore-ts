import { DMMF, DMMFClass, Engine } from './runtime';
/**
 * Utility Types
 */
export declare type Enumerable<T> = T | Array<T>;
export declare type MergeTruthyValues<R extends object, S extends object> = {
    [key in keyof S | keyof R]: key extends false ? never : key extends keyof S ? S[key] extends false ? never : S[key] : key extends keyof R ? R[key] : never;
};
export declare type CleanupNever<T> = {
    [key in keyof T]: T[key] extends never ? never : key;
}[keyof T];
/**
 * Subset
 * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
 */
export declare type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
declare class PhotonFetcher {
    private readonly photon;
    private readonly engine;
    private readonly debug;
    private readonly hooks?;
    constructor(photon: Photon, engine: Engine, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, path?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    protected unpack(data: any, path: string[], rootField?: string, isList?: boolean): any;
}
/**
 * Client
**/
export declare type Datasources = {
    db?: string;
};
export interface PhotonOptions {
    datasources?: Datasources;
    debug?: boolean | {
        engine?: boolean;
        library?: boolean;
    };
    /**
     * You probably don't want to use this. `__internal` is used by internal tooling.
     */
    __internal?: {
        hooks?: Hooks;
        engine?: {
            cwd?: string;
            binaryPath?: string;
        };
    };
}
export declare type Hooks = {
    beforeRequest?: (options: {
        query: string;
        path: string[];
        rootField?: string;
        typeName?: string;
        document: any;
    }) => any;
};
export declare class Photon {
    private fetcher;
    private readonly dmmf;
    private readonly engine;
    private readonly datamodel;
    private connectionPromise?;
    constructor(options?: PhotonOptions);
    private connectEngine;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    readonly users: UserDelegate;
    readonly authors: AuthorDelegate;
    readonly books: BookDelegate;
}
export declare const OrderByArg: {
    asc: "asc";
    desc: "desc";
};
export declare type OrderByArg = (typeof OrderByArg)[keyof typeof OrderByArg];
/**
 * Model User
 */
export declare type User = {
    id: string;
    email: string;
    password: string;
};
export declare type UserScalars = 'id' | 'email' | 'password';
export declare type UserSelect = {
    id?: boolean;
    email?: boolean;
    password?: boolean;
};
export declare type UserInclude = {};
declare type UserDefault = {
    id: true;
    email: true;
    password: true;
};
declare type UserGetSelectPayload<S extends boolean | UserSelect> = S extends true ? User : S extends UserSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends UserScalars ? User[P] : never;
} : never;
declare type UserGetIncludePayload<S extends boolean | UserInclude> = S extends true ? User : S extends UserInclude ? {
    [P in CleanupNever<MergeTruthyValues<UserDefault, S>>]: P extends UserScalars ? User[P] : never;
} : never;
export interface UserDelegate {
    <T extends FindManyUserArgs>(args?: Subset<T, FindManyUserArgs>): T extends FindManyUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyUserSelectArgs ? Promise<Array<UserGetSelectPayload<ExtractFindManyUserSelectArgs<T>>>> : T extends FindManyUserIncludeArgs ? Promise<Array<UserGetIncludePayload<ExtractFindManyUserIncludeArgs<T>>>> : Promise<Array<User>>;
    findOne<T extends FindOneUserArgs>(args: Subset<T, FindOneUserArgs>): T extends FindOneUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneUserSelectArgs ? Promise<UserGetSelectPayload<ExtractFindOneUserSelectArgs<T>>> : T extends FindOneUserIncludeArgs ? Promise<UserGetIncludePayload<ExtractFindOneUserIncludeArgs<T>>> : UserClient<User>;
    findMany<T extends FindManyUserArgs>(args?: Subset<T, FindManyUserArgs>): T extends FindManyUserArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyUserSelectArgs ? Promise<Array<UserGetSelectPayload<ExtractFindManyUserSelectArgs<T>>>> : T extends FindManyUserIncludeArgs ? Promise<Array<UserGetIncludePayload<ExtractFindManyUserIncludeArgs<T>>>> : Promise<Array<User>>;
    create<T extends UserCreateArgs>(args: Subset<T, UserCreateArgs>): T extends UserCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectCreateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectCreateArgs<T>>> : T extends UserIncludeCreateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeCreateArgs<T>>> : UserClient<User>;
    delete<T extends UserDeleteArgs>(args: Subset<T, UserDeleteArgs>): T extends UserDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectDeleteArgs ? Promise<UserGetSelectPayload<ExtractUserSelectDeleteArgs<T>>> : T extends UserIncludeDeleteArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeDeleteArgs<T>>> : UserClient<User>;
    update<T extends UserUpdateArgs>(args: Subset<T, UserUpdateArgs>): T extends UserUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpdateArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpdateArgs<T>>> : T extends UserIncludeUpdateArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpdateArgs<T>>> : UserClient<User>;
    deleteMany<T extends UserDeleteManyArgs>(args: Subset<T, UserDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Subset<T, UserUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends UserUpsertArgs>(args: Subset<T, UserUpsertArgs>): T extends UserUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends UserSelectUpsertArgs ? Promise<UserGetSelectPayload<ExtractUserSelectUpsertArgs<T>>> : T extends UserIncludeUpsertArgs ? Promise<UserGetIncludePayload<ExtractUserIncludeUpsertArgs<T>>> : UserClient<User>;
    count(): Promise<number>;
}
export declare class UserClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    private readonly _document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * User findOne
 */
export declare type FindOneUserArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserSelectArgs = {
    select: UserSelect;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserSelectArgsOptional = {
    select?: UserSelect | null;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserIncludeArgs = {
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type FindOneUserIncludeArgsOptional = {
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type ExtractFindOneUserSelectArgs<S extends undefined | boolean | FindOneUserSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneUserSelectArgs ? S['select'] : true;
export declare type ExtractFindOneUserIncludeArgs<S extends undefined | boolean | FindOneUserIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneUserIncludeArgs ? S['include'] : true;
/**
 * User findMany
 */
export declare type FindManyUserArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserSelectArgs = {
    select: UserSelect;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserSelectArgsOptional = {
    select?: UserSelect | null;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserIncludeArgs = {
    include: UserInclude;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyUserIncludeArgsOptional = {
    include?: UserInclude | null;
    where?: UserWhereInput | null;
    orderBy?: UserOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyUserSelectArgs<S extends undefined | boolean | FindManyUserSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyUserSelectArgs ? S['select'] : true;
export declare type ExtractFindManyUserIncludeArgs<S extends undefined | boolean | FindManyUserIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyUserIncludeArgs ? S['include'] : true;
/**
 * User create
 */
export declare type UserCreateArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    data: UserCreateInput;
};
export declare type UserCreateArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    data: UserCreateInput;
};
export declare type UserSelectCreateArgs = {
    select: UserSelect;
    data: UserCreateInput;
};
export declare type UserSelectCreateArgsOptional = {
    select?: UserSelect | null;
    data: UserCreateInput;
};
export declare type UserIncludeCreateArgs = {
    include: UserInclude;
    data: UserCreateInput;
};
export declare type UserIncludeCreateArgsOptional = {
    include?: UserInclude | null;
    data: UserCreateInput;
};
export declare type ExtractUserSelectCreateArgs<S extends undefined | boolean | UserSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectCreateArgs ? S['select'] : true;
export declare type ExtractUserIncludeCreateArgs<S extends undefined | boolean | UserIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeCreateArgs ? S['include'] : true;
/**
 * User update
 */
export declare type UserUpdateArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserUpdateArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserSelectUpdateArgs = {
    select: UserSelect;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserSelectUpdateArgsOptional = {
    select?: UserSelect | null;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeUpdateArgs = {
    include: UserInclude;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeUpdateArgsOptional = {
    include?: UserInclude | null;
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
};
export declare type ExtractUserSelectUpdateArgs<S extends undefined | boolean | UserSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectUpdateArgs ? S['select'] : true;
export declare type ExtractUserIncludeUpdateArgs<S extends undefined | boolean | UserIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeUpdateArgs ? S['include'] : true;
/**
 * User updateMany
 */
export declare type UserUpdateManyArgs = {
    data: UserUpdateManyMutationInput;
    where?: UserWhereInput | null;
};
/**
 * User upsert
 */
export declare type UserUpsertArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserUpsertArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserSelectUpsertArgs = {
    select: UserSelect;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserSelectUpsertArgsOptional = {
    select?: UserSelect | null;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserIncludeUpsertArgs = {
    include: UserInclude;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type UserIncludeUpsertArgsOptional = {
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
    create: UserCreateInput;
    update: UserUpdateInput;
};
export declare type ExtractUserSelectUpsertArgs<S extends undefined | boolean | UserSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectUpsertArgs ? S['select'] : true;
export declare type ExtractUserIncludeUpsertArgs<S extends undefined | boolean | UserIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeUpsertArgs ? S['include'] : true;
/**
 * User delete
 */
export declare type UserDeleteArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type UserDeleteArgsRequired = {
    select: UserSelect;
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type UserSelectDeleteArgs = {
    select: UserSelect;
    where: UserWhereUniqueInput;
};
export declare type UserSelectDeleteArgsOptional = {
    select?: UserSelect | null;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeDeleteArgs = {
    include: UserInclude;
    where: UserWhereUniqueInput;
};
export declare type UserIncludeDeleteArgsOptional = {
    include?: UserInclude | null;
    where: UserWhereUniqueInput;
};
export declare type ExtractUserSelectDeleteArgs<S extends undefined | boolean | UserSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectDeleteArgs ? S['select'] : true;
export declare type ExtractUserIncludeDeleteArgs<S extends undefined | boolean | UserIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeDeleteArgs ? S['include'] : true;
/**
 * User deleteMany
 */
export declare type UserDeleteManyArgs = {
    where?: UserWhereInput | null;
};
/**
 * User without action
 */
export declare type UserArgs = {
    select?: UserSelect | null;
    include?: UserInclude | null;
};
export declare type UserArgsRequired = {
    select: UserSelect;
    include: UserInclude;
};
export declare type UserSelectArgs = {
    select: UserSelect;
};
export declare type UserSelectArgsOptional = {
    select?: UserSelect | null;
};
export declare type UserIncludeArgs = {
    include: UserInclude;
};
export declare type UserIncludeArgsOptional = {
    include?: UserInclude | null;
};
export declare type ExtractUserSelectArgs<S extends undefined | boolean | UserSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserSelectArgs ? S['select'] : true;
export declare type ExtractUserIncludeArgs<S extends undefined | boolean | UserIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends UserIncludeArgs ? S['include'] : true;
/**
 * Model Author
 */
export declare type Author = {
    id: string;
    name: string;
    country: string;
};
export declare type AuthorScalars = 'id' | 'name' | 'country';
export declare type AuthorSelect = {
    id?: boolean;
    name?: boolean;
    country?: boolean;
    books?: boolean | FindManyBookSelectArgsOptional;
};
export declare type AuthorInclude = {
    books?: boolean | FindManyBookIncludeArgsOptional;
};
declare type AuthorDefault = {
    id: true;
    name: true;
    country: true;
};
declare type AuthorGetSelectPayload<S extends boolean | AuthorSelect> = S extends true ? Author : S extends AuthorSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends AuthorScalars ? Author[P] : P extends 'books' ? Array<BookGetSelectPayload<ExtractFindManyBookSelectArgs<S[P]>>> : never;
} : never;
declare type AuthorGetIncludePayload<S extends boolean | AuthorInclude> = S extends true ? Author : S extends AuthorInclude ? {
    [P in CleanupNever<MergeTruthyValues<AuthorDefault, S>>]: P extends AuthorScalars ? Author[P] : P extends 'books' ? Array<BookGetIncludePayload<ExtractFindManyBookIncludeArgs<S[P]>>> : never;
} : never;
export interface AuthorDelegate {
    <T extends FindManyAuthorArgs>(args?: Subset<T, FindManyAuthorArgs>): T extends FindManyAuthorArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAuthorSelectArgs ? Promise<Array<AuthorGetSelectPayload<ExtractFindManyAuthorSelectArgs<T>>>> : T extends FindManyAuthorIncludeArgs ? Promise<Array<AuthorGetIncludePayload<ExtractFindManyAuthorIncludeArgs<T>>>> : Promise<Array<Author>>;
    findOne<T extends FindOneAuthorArgs>(args: Subset<T, FindOneAuthorArgs>): T extends FindOneAuthorArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneAuthorSelectArgs ? Promise<AuthorGetSelectPayload<ExtractFindOneAuthorSelectArgs<T>>> : T extends FindOneAuthorIncludeArgs ? Promise<AuthorGetIncludePayload<ExtractFindOneAuthorIncludeArgs<T>>> : AuthorClient<Author>;
    findMany<T extends FindManyAuthorArgs>(args?: Subset<T, FindManyAuthorArgs>): T extends FindManyAuthorArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyAuthorSelectArgs ? Promise<Array<AuthorGetSelectPayload<ExtractFindManyAuthorSelectArgs<T>>>> : T extends FindManyAuthorIncludeArgs ? Promise<Array<AuthorGetIncludePayload<ExtractFindManyAuthorIncludeArgs<T>>>> : Promise<Array<Author>>;
    create<T extends AuthorCreateArgs>(args: Subset<T, AuthorCreateArgs>): T extends AuthorCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends AuthorSelectCreateArgs ? Promise<AuthorGetSelectPayload<ExtractAuthorSelectCreateArgs<T>>> : T extends AuthorIncludeCreateArgs ? Promise<AuthorGetIncludePayload<ExtractAuthorIncludeCreateArgs<T>>> : AuthorClient<Author>;
    delete<T extends AuthorDeleteArgs>(args: Subset<T, AuthorDeleteArgs>): T extends AuthorDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends AuthorSelectDeleteArgs ? Promise<AuthorGetSelectPayload<ExtractAuthorSelectDeleteArgs<T>>> : T extends AuthorIncludeDeleteArgs ? Promise<AuthorGetIncludePayload<ExtractAuthorIncludeDeleteArgs<T>>> : AuthorClient<Author>;
    update<T extends AuthorUpdateArgs>(args: Subset<T, AuthorUpdateArgs>): T extends AuthorUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends AuthorSelectUpdateArgs ? Promise<AuthorGetSelectPayload<ExtractAuthorSelectUpdateArgs<T>>> : T extends AuthorIncludeUpdateArgs ? Promise<AuthorGetIncludePayload<ExtractAuthorIncludeUpdateArgs<T>>> : AuthorClient<Author>;
    deleteMany<T extends AuthorDeleteManyArgs>(args: Subset<T, AuthorDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends AuthorUpdateManyArgs>(args: Subset<T, AuthorUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends AuthorUpsertArgs>(args: Subset<T, AuthorUpsertArgs>): T extends AuthorUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends AuthorSelectUpsertArgs ? Promise<AuthorGetSelectPayload<ExtractAuthorSelectUpsertArgs<T>>> : T extends AuthorIncludeUpsertArgs ? Promise<AuthorGetIncludePayload<ExtractAuthorIncludeUpsertArgs<T>>> : AuthorClient<Author>;
    count(): Promise<number>;
}
export declare class AuthorClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    books<T extends FindManyBookArgs = {}>(args?: Subset<T, FindManyBookArgs>): T extends FindManyBookArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyBookSelectArgs ? Promise<Array<BookGetSelectPayload<ExtractFindManyBookSelectArgs<T>>>> : T extends FindManyBookIncludeArgs ? Promise<Array<BookGetIncludePayload<ExtractFindManyBookIncludeArgs<T>>>> : Promise<Array<Book>>;
    private readonly _document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * Author findOne
 */
export declare type FindOneAuthorArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
    where: AuthorWhereUniqueInput;
};
export declare type FindOneAuthorArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
    where: AuthorWhereUniqueInput;
};
export declare type FindOneAuthorSelectArgs = {
    select: AuthorSelect;
    where: AuthorWhereUniqueInput;
};
export declare type FindOneAuthorSelectArgsOptional = {
    select?: AuthorSelect | null;
    where: AuthorWhereUniqueInput;
};
export declare type FindOneAuthorIncludeArgs = {
    include: AuthorInclude;
    where: AuthorWhereUniqueInput;
};
export declare type FindOneAuthorIncludeArgsOptional = {
    include?: AuthorInclude | null;
    where: AuthorWhereUniqueInput;
};
export declare type ExtractFindOneAuthorSelectArgs<S extends undefined | boolean | FindOneAuthorSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneAuthorSelectArgs ? S['select'] : true;
export declare type ExtractFindOneAuthorIncludeArgs<S extends undefined | boolean | FindOneAuthorIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneAuthorIncludeArgs ? S['include'] : true;
/**
 * Author findMany
 */
export declare type FindManyAuthorArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
    where?: AuthorWhereInput | null;
    orderBy?: AuthorOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuthorArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
    where?: AuthorWhereInput | null;
    orderBy?: AuthorOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuthorSelectArgs = {
    select: AuthorSelect;
    where?: AuthorWhereInput | null;
    orderBy?: AuthorOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuthorSelectArgsOptional = {
    select?: AuthorSelect | null;
    where?: AuthorWhereInput | null;
    orderBy?: AuthorOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuthorIncludeArgs = {
    include: AuthorInclude;
    where?: AuthorWhereInput | null;
    orderBy?: AuthorOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyAuthorIncludeArgsOptional = {
    include?: AuthorInclude | null;
    where?: AuthorWhereInput | null;
    orderBy?: AuthorOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyAuthorSelectArgs<S extends undefined | boolean | FindManyAuthorSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyAuthorSelectArgs ? S['select'] : true;
export declare type ExtractFindManyAuthorIncludeArgs<S extends undefined | boolean | FindManyAuthorIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyAuthorIncludeArgs ? S['include'] : true;
/**
 * Author create
 */
export declare type AuthorCreateArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
    data: AuthorCreateInput;
};
export declare type AuthorCreateArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
    data: AuthorCreateInput;
};
export declare type AuthorSelectCreateArgs = {
    select: AuthorSelect;
    data: AuthorCreateInput;
};
export declare type AuthorSelectCreateArgsOptional = {
    select?: AuthorSelect | null;
    data: AuthorCreateInput;
};
export declare type AuthorIncludeCreateArgs = {
    include: AuthorInclude;
    data: AuthorCreateInput;
};
export declare type AuthorIncludeCreateArgsOptional = {
    include?: AuthorInclude | null;
    data: AuthorCreateInput;
};
export declare type ExtractAuthorSelectCreateArgs<S extends undefined | boolean | AuthorSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorSelectCreateArgs ? S['select'] : true;
export declare type ExtractAuthorIncludeCreateArgs<S extends undefined | boolean | AuthorIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorIncludeCreateArgs ? S['include'] : true;
/**
 * Author update
 */
export declare type AuthorUpdateArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
    data: AuthorUpdateInput;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorUpdateArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
    data: AuthorUpdateInput;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorSelectUpdateArgs = {
    select: AuthorSelect;
    data: AuthorUpdateInput;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorSelectUpdateArgsOptional = {
    select?: AuthorSelect | null;
    data: AuthorUpdateInput;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorIncludeUpdateArgs = {
    include: AuthorInclude;
    data: AuthorUpdateInput;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorIncludeUpdateArgsOptional = {
    include?: AuthorInclude | null;
    data: AuthorUpdateInput;
    where: AuthorWhereUniqueInput;
};
export declare type ExtractAuthorSelectUpdateArgs<S extends undefined | boolean | AuthorSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorSelectUpdateArgs ? S['select'] : true;
export declare type ExtractAuthorIncludeUpdateArgs<S extends undefined | boolean | AuthorIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorIncludeUpdateArgs ? S['include'] : true;
/**
 * Author updateMany
 */
export declare type AuthorUpdateManyArgs = {
    data: AuthorUpdateManyMutationInput;
    where?: AuthorWhereInput | null;
};
/**
 * Author upsert
 */
export declare type AuthorUpsertArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
    where: AuthorWhereUniqueInput;
    create: AuthorCreateInput;
    update: AuthorUpdateInput;
};
export declare type AuthorUpsertArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
    where: AuthorWhereUniqueInput;
    create: AuthorCreateInput;
    update: AuthorUpdateInput;
};
export declare type AuthorSelectUpsertArgs = {
    select: AuthorSelect;
    where: AuthorWhereUniqueInput;
    create: AuthorCreateInput;
    update: AuthorUpdateInput;
};
export declare type AuthorSelectUpsertArgsOptional = {
    select?: AuthorSelect | null;
    where: AuthorWhereUniqueInput;
    create: AuthorCreateInput;
    update: AuthorUpdateInput;
};
export declare type AuthorIncludeUpsertArgs = {
    include: AuthorInclude;
    where: AuthorWhereUniqueInput;
    create: AuthorCreateInput;
    update: AuthorUpdateInput;
};
export declare type AuthorIncludeUpsertArgsOptional = {
    include?: AuthorInclude | null;
    where: AuthorWhereUniqueInput;
    create: AuthorCreateInput;
    update: AuthorUpdateInput;
};
export declare type ExtractAuthorSelectUpsertArgs<S extends undefined | boolean | AuthorSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorSelectUpsertArgs ? S['select'] : true;
export declare type ExtractAuthorIncludeUpsertArgs<S extends undefined | boolean | AuthorIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorIncludeUpsertArgs ? S['include'] : true;
/**
 * Author delete
 */
export declare type AuthorDeleteArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorDeleteArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorSelectDeleteArgs = {
    select: AuthorSelect;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorSelectDeleteArgsOptional = {
    select?: AuthorSelect | null;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorIncludeDeleteArgs = {
    include: AuthorInclude;
    where: AuthorWhereUniqueInput;
};
export declare type AuthorIncludeDeleteArgsOptional = {
    include?: AuthorInclude | null;
    where: AuthorWhereUniqueInput;
};
export declare type ExtractAuthorSelectDeleteArgs<S extends undefined | boolean | AuthorSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorSelectDeleteArgs ? S['select'] : true;
export declare type ExtractAuthorIncludeDeleteArgs<S extends undefined | boolean | AuthorIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorIncludeDeleteArgs ? S['include'] : true;
/**
 * Author deleteMany
 */
export declare type AuthorDeleteManyArgs = {
    where?: AuthorWhereInput | null;
};
/**
 * Author without action
 */
export declare type AuthorArgs = {
    select?: AuthorSelect | null;
    include?: AuthorInclude | null;
};
export declare type AuthorArgsRequired = {
    select: AuthorSelect;
    include: AuthorInclude;
};
export declare type AuthorSelectArgs = {
    select: AuthorSelect;
};
export declare type AuthorSelectArgsOptional = {
    select?: AuthorSelect | null;
};
export declare type AuthorIncludeArgs = {
    include: AuthorInclude;
};
export declare type AuthorIncludeArgsOptional = {
    include?: AuthorInclude | null;
};
export declare type ExtractAuthorSelectArgs<S extends undefined | boolean | AuthorSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorSelectArgs ? S['select'] : true;
export declare type ExtractAuthorIncludeArgs<S extends undefined | boolean | AuthorIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends AuthorIncludeArgs ? S['include'] : true;
/**
 * Model Book
 */
export declare type Book = {
    id: string;
    title: string;
    description: string;
    quantity: number | null;
    price: number;
};
export declare type BookScalars = 'id' | 'title' | 'description' | 'quantity' | 'price';
export declare type BookSelect = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    quantity?: boolean;
    author?: boolean | AuthorSelectArgsOptional;
    price?: boolean;
};
export declare type BookInclude = {
    author?: boolean | AuthorIncludeArgsOptional;
};
declare type BookDefault = {
    id: true;
    title: true;
    description: true;
    quantity: true;
    price: true;
};
declare type BookGetSelectPayload<S extends boolean | BookSelect> = S extends true ? Book : S extends BookSelect ? {
    [P in CleanupNever<MergeTruthyValues<{}, S>>]: P extends BookScalars ? Book[P] : P extends 'author' ? AuthorGetSelectPayload<ExtractAuthorSelectArgs<S[P]>> : never;
} : never;
declare type BookGetIncludePayload<S extends boolean | BookInclude> = S extends true ? Book : S extends BookInclude ? {
    [P in CleanupNever<MergeTruthyValues<BookDefault, S>>]: P extends BookScalars ? Book[P] : P extends 'author' ? AuthorGetIncludePayload<ExtractAuthorIncludeArgs<S[P]>> : never;
} : never;
export interface BookDelegate {
    <T extends FindManyBookArgs>(args?: Subset<T, FindManyBookArgs>): T extends FindManyBookArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyBookSelectArgs ? Promise<Array<BookGetSelectPayload<ExtractFindManyBookSelectArgs<T>>>> : T extends FindManyBookIncludeArgs ? Promise<Array<BookGetIncludePayload<ExtractFindManyBookIncludeArgs<T>>>> : Promise<Array<Book>>;
    findOne<T extends FindOneBookArgs>(args: Subset<T, FindOneBookArgs>): T extends FindOneBookArgsRequired ? 'Please either choose `select` or `include`' : T extends FindOneBookSelectArgs ? Promise<BookGetSelectPayload<ExtractFindOneBookSelectArgs<T>>> : T extends FindOneBookIncludeArgs ? Promise<BookGetIncludePayload<ExtractFindOneBookIncludeArgs<T>>> : BookClient<Book>;
    findMany<T extends FindManyBookArgs>(args?: Subset<T, FindManyBookArgs>): T extends FindManyBookArgsRequired ? 'Please either choose `select` or `include`' : T extends FindManyBookSelectArgs ? Promise<Array<BookGetSelectPayload<ExtractFindManyBookSelectArgs<T>>>> : T extends FindManyBookIncludeArgs ? Promise<Array<BookGetIncludePayload<ExtractFindManyBookIncludeArgs<T>>>> : Promise<Array<Book>>;
    create<T extends BookCreateArgs>(args: Subset<T, BookCreateArgs>): T extends BookCreateArgsRequired ? 'Please either choose `select` or `include`' : T extends BookSelectCreateArgs ? Promise<BookGetSelectPayload<ExtractBookSelectCreateArgs<T>>> : T extends BookIncludeCreateArgs ? Promise<BookGetIncludePayload<ExtractBookIncludeCreateArgs<T>>> : BookClient<Book>;
    delete<T extends BookDeleteArgs>(args: Subset<T, BookDeleteArgs>): T extends BookDeleteArgsRequired ? 'Please either choose `select` or `include`' : T extends BookSelectDeleteArgs ? Promise<BookGetSelectPayload<ExtractBookSelectDeleteArgs<T>>> : T extends BookIncludeDeleteArgs ? Promise<BookGetIncludePayload<ExtractBookIncludeDeleteArgs<T>>> : BookClient<Book>;
    update<T extends BookUpdateArgs>(args: Subset<T, BookUpdateArgs>): T extends BookUpdateArgsRequired ? 'Please either choose `select` or `include`' : T extends BookSelectUpdateArgs ? Promise<BookGetSelectPayload<ExtractBookSelectUpdateArgs<T>>> : T extends BookIncludeUpdateArgs ? Promise<BookGetIncludePayload<ExtractBookIncludeUpdateArgs<T>>> : BookClient<Book>;
    deleteMany<T extends BookDeleteManyArgs>(args: Subset<T, BookDeleteManyArgs>): Promise<BatchPayload>;
    updateMany<T extends BookUpdateManyArgs>(args: Subset<T, BookUpdateManyArgs>): Promise<BatchPayload>;
    upsert<T extends BookUpsertArgs>(args: Subset<T, BookUpsertArgs>): T extends BookUpsertArgsRequired ? 'Please either choose `select` or `include`' : T extends BookSelectUpsertArgs ? Promise<BookGetSelectPayload<ExtractBookSelectUpsertArgs<T>>> : T extends BookIncludeUpsertArgs ? Promise<BookGetIncludePayload<ExtractBookIncludeUpsertArgs<T>>> : BookClient<Book>;
    count(): Promise<number>;
}
export declare class BookClient<T> implements Promise<T> {
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _path;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: DMMFClass, _fetcher: PhotonFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _path: string[], _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PhotonPromise';
    author<T extends AuthorArgs = {}>(args?: Subset<T, AuthorArgs>): T extends FindOneAuthorArgsRequired ? 'Please either choose `select` or `include`' : T extends AuthorSelectArgs ? Promise<AuthorGetSelectPayload<ExtractAuthorSelectArgs<T>>> : T extends AuthorIncludeArgs ? Promise<AuthorGetIncludePayload<ExtractAuthorIncludeArgs<T>>> : AuthorClient<Author>;
    private readonly _document;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | Promise<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
}
/**
 * Book findOne
 */
export declare type FindOneBookArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
    where: BookWhereUniqueInput;
};
export declare type FindOneBookArgsRequired = {
    select: BookSelect;
    include: BookInclude;
    where: BookWhereUniqueInput;
};
export declare type FindOneBookSelectArgs = {
    select: BookSelect;
    where: BookWhereUniqueInput;
};
export declare type FindOneBookSelectArgsOptional = {
    select?: BookSelect | null;
    where: BookWhereUniqueInput;
};
export declare type FindOneBookIncludeArgs = {
    include: BookInclude;
    where: BookWhereUniqueInput;
};
export declare type FindOneBookIncludeArgsOptional = {
    include?: BookInclude | null;
    where: BookWhereUniqueInput;
};
export declare type ExtractFindOneBookSelectArgs<S extends undefined | boolean | FindOneBookSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneBookSelectArgs ? S['select'] : true;
export declare type ExtractFindOneBookIncludeArgs<S extends undefined | boolean | FindOneBookIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindOneBookIncludeArgs ? S['include'] : true;
/**
 * Book findMany
 */
export declare type FindManyBookArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
    where?: BookWhereInput | null;
    orderBy?: BookOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyBookArgsRequired = {
    select: BookSelect;
    include: BookInclude;
    where?: BookWhereInput | null;
    orderBy?: BookOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyBookSelectArgs = {
    select: BookSelect;
    where?: BookWhereInput | null;
    orderBy?: BookOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyBookSelectArgsOptional = {
    select?: BookSelect | null;
    where?: BookWhereInput | null;
    orderBy?: BookOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyBookIncludeArgs = {
    include: BookInclude;
    where?: BookWhereInput | null;
    orderBy?: BookOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type FindManyBookIncludeArgsOptional = {
    include?: BookInclude | null;
    where?: BookWhereInput | null;
    orderBy?: BookOrderByInput | null;
    skip?: number | null;
    after?: string | null;
    before?: string | null;
    first?: number | null;
    last?: number | null;
};
export declare type ExtractFindManyBookSelectArgs<S extends undefined | boolean | FindManyBookSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyBookSelectArgs ? S['select'] : true;
export declare type ExtractFindManyBookIncludeArgs<S extends undefined | boolean | FindManyBookIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends FindManyBookIncludeArgs ? S['include'] : true;
/**
 * Book create
 */
export declare type BookCreateArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
    data: BookCreateInput;
};
export declare type BookCreateArgsRequired = {
    select: BookSelect;
    include: BookInclude;
    data: BookCreateInput;
};
export declare type BookSelectCreateArgs = {
    select: BookSelect;
    data: BookCreateInput;
};
export declare type BookSelectCreateArgsOptional = {
    select?: BookSelect | null;
    data: BookCreateInput;
};
export declare type BookIncludeCreateArgs = {
    include: BookInclude;
    data: BookCreateInput;
};
export declare type BookIncludeCreateArgsOptional = {
    include?: BookInclude | null;
    data: BookCreateInput;
};
export declare type ExtractBookSelectCreateArgs<S extends undefined | boolean | BookSelectCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookSelectCreateArgs ? S['select'] : true;
export declare type ExtractBookIncludeCreateArgs<S extends undefined | boolean | BookIncludeCreateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookIncludeCreateArgs ? S['include'] : true;
/**
 * Book update
 */
export declare type BookUpdateArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
    data: BookUpdateInput;
    where: BookWhereUniqueInput;
};
export declare type BookUpdateArgsRequired = {
    select: BookSelect;
    include: BookInclude;
    data: BookUpdateInput;
    where: BookWhereUniqueInput;
};
export declare type BookSelectUpdateArgs = {
    select: BookSelect;
    data: BookUpdateInput;
    where: BookWhereUniqueInput;
};
export declare type BookSelectUpdateArgsOptional = {
    select?: BookSelect | null;
    data: BookUpdateInput;
    where: BookWhereUniqueInput;
};
export declare type BookIncludeUpdateArgs = {
    include: BookInclude;
    data: BookUpdateInput;
    where: BookWhereUniqueInput;
};
export declare type BookIncludeUpdateArgsOptional = {
    include?: BookInclude | null;
    data: BookUpdateInput;
    where: BookWhereUniqueInput;
};
export declare type ExtractBookSelectUpdateArgs<S extends undefined | boolean | BookSelectUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookSelectUpdateArgs ? S['select'] : true;
export declare type ExtractBookIncludeUpdateArgs<S extends undefined | boolean | BookIncludeUpdateArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookIncludeUpdateArgs ? S['include'] : true;
/**
 * Book updateMany
 */
export declare type BookUpdateManyArgs = {
    data: BookUpdateManyMutationInput;
    where?: BookWhereInput | null;
};
/**
 * Book upsert
 */
export declare type BookUpsertArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
    where: BookWhereUniqueInput;
    create: BookCreateInput;
    update: BookUpdateInput;
};
export declare type BookUpsertArgsRequired = {
    select: BookSelect;
    include: BookInclude;
    where: BookWhereUniqueInput;
    create: BookCreateInput;
    update: BookUpdateInput;
};
export declare type BookSelectUpsertArgs = {
    select: BookSelect;
    where: BookWhereUniqueInput;
    create: BookCreateInput;
    update: BookUpdateInput;
};
export declare type BookSelectUpsertArgsOptional = {
    select?: BookSelect | null;
    where: BookWhereUniqueInput;
    create: BookCreateInput;
    update: BookUpdateInput;
};
export declare type BookIncludeUpsertArgs = {
    include: BookInclude;
    where: BookWhereUniqueInput;
    create: BookCreateInput;
    update: BookUpdateInput;
};
export declare type BookIncludeUpsertArgsOptional = {
    include?: BookInclude | null;
    where: BookWhereUniqueInput;
    create: BookCreateInput;
    update: BookUpdateInput;
};
export declare type ExtractBookSelectUpsertArgs<S extends undefined | boolean | BookSelectUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookSelectUpsertArgs ? S['select'] : true;
export declare type ExtractBookIncludeUpsertArgs<S extends undefined | boolean | BookIncludeUpsertArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookIncludeUpsertArgs ? S['include'] : true;
/**
 * Book delete
 */
export declare type BookDeleteArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
    where: BookWhereUniqueInput;
};
export declare type BookDeleteArgsRequired = {
    select: BookSelect;
    include: BookInclude;
    where: BookWhereUniqueInput;
};
export declare type BookSelectDeleteArgs = {
    select: BookSelect;
    where: BookWhereUniqueInput;
};
export declare type BookSelectDeleteArgsOptional = {
    select?: BookSelect | null;
    where: BookWhereUniqueInput;
};
export declare type BookIncludeDeleteArgs = {
    include: BookInclude;
    where: BookWhereUniqueInput;
};
export declare type BookIncludeDeleteArgsOptional = {
    include?: BookInclude | null;
    where: BookWhereUniqueInput;
};
export declare type ExtractBookSelectDeleteArgs<S extends undefined | boolean | BookSelectDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookSelectDeleteArgs ? S['select'] : true;
export declare type ExtractBookIncludeDeleteArgs<S extends undefined | boolean | BookIncludeDeleteArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookIncludeDeleteArgs ? S['include'] : true;
/**
 * Book deleteMany
 */
export declare type BookDeleteManyArgs = {
    where?: BookWhereInput | null;
};
/**
 * Book without action
 */
export declare type BookArgs = {
    select?: BookSelect | null;
    include?: BookInclude | null;
};
export declare type BookArgsRequired = {
    select: BookSelect;
    include: BookInclude;
};
export declare type BookSelectArgs = {
    select: BookSelect;
};
export declare type BookSelectArgsOptional = {
    select?: BookSelect | null;
};
export declare type BookIncludeArgs = {
    include: BookInclude;
};
export declare type BookIncludeArgsOptional = {
    include?: BookInclude | null;
};
export declare type ExtractBookSelectArgs<S extends undefined | boolean | BookSelectArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookSelectArgs ? S['select'] : true;
export declare type ExtractBookIncludeArgs<S extends undefined | boolean | BookIncludeArgsOptional> = S extends undefined ? false : S extends boolean ? S : S extends BookIncludeArgs ? S['include'] : true;
/**
 * Deep Input Types
 */
export declare type UserWhereInput = {
    id?: string | StringFilter | null;
    email?: string | StringFilter | null;
    password?: string | StringFilter | null;
    AND?: Enumerable<UserWhereInput> | null;
    OR?: Enumerable<UserWhereInput> | null;
    NOT?: Enumerable<UserWhereInput> | null;
};
export declare type UserWhereUniqueInput = {
    id?: string | null;
    email?: string | null;
};
export declare type BookWhereInput = {
    id?: string | StringFilter | null;
    title?: string | StringFilter | null;
    description?: string | StringFilter | null;
    quantity?: number | NullableIntFilter | null | null;
    price?: number | IntFilter | null;
    AND?: Enumerable<BookWhereInput> | null;
    OR?: Enumerable<BookWhereInput> | null;
    NOT?: Enumerable<BookWhereInput> | null;
    author?: AuthorWhereInput | null;
};
export declare type AuthorWhereInput = {
    id?: string | StringFilter | null;
    name?: string | StringFilter | null;
    country?: string | StringFilter | null;
    books?: BookFilter | null;
    AND?: Enumerable<AuthorWhereInput> | null;
    OR?: Enumerable<AuthorWhereInput> | null;
    NOT?: Enumerable<AuthorWhereInput> | null;
};
export declare type AuthorWhereUniqueInput = {
    id?: string | null;
};
export declare type BookWhereUniqueInput = {
    id?: string | null;
};
export declare type UserCreateInput = {
    id?: string | null;
    email: string;
    password: string;
};
export declare type UserUpdateInput = {
    id?: string | null;
    email?: string | null;
    password?: string | null;
};
export declare type UserUpdateManyMutationInput = {
    id?: string | null;
    email?: string | null;
    password?: string | null;
};
export declare type BookCreateWithoutAuthorInput = {
    id?: string | null;
    title: string;
    description: string;
    quantity?: number | null;
    price: number;
};
export declare type BookCreateManyWithoutBooksInput = {
    create?: Enumerable<BookCreateWithoutAuthorInput> | null;
    connect?: Enumerable<BookWhereUniqueInput> | null;
};
export declare type AuthorCreateInput = {
    id?: string | null;
    name: string;
    country: string;
    books?: BookCreateManyWithoutBooksInput | null;
};
export declare type BookUpdateWithoutAuthorDataInput = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    quantity?: number | null;
    price?: number | null;
};
export declare type BookUpdateWithWhereUniqueWithoutAuthorInput = {
    where: BookWhereUniqueInput;
    data: BookUpdateWithoutAuthorDataInput;
};
export declare type BookScalarWhereInput = {
    id?: string | StringFilter | null;
    title?: string | StringFilter | null;
    description?: string | StringFilter | null;
    quantity?: number | NullableIntFilter | null | null;
    price?: number | IntFilter | null;
    AND?: Enumerable<BookScalarWhereInput> | null;
    OR?: Enumerable<BookScalarWhereInput> | null;
    NOT?: Enumerable<BookScalarWhereInput> | null;
};
export declare type BookUpdateManyDataInput = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    quantity?: number | null;
    price?: number | null;
};
export declare type BookUpdateManyWithWhereNestedInput = {
    where: BookScalarWhereInput;
    data: BookUpdateManyDataInput;
};
export declare type BookUpsertWithWhereUniqueWithoutAuthorInput = {
    where: BookWhereUniqueInput;
    update: BookUpdateWithoutAuthorDataInput;
    create: BookCreateWithoutAuthorInput;
};
export declare type BookUpdateManyWithoutAuthorInput = {
    create?: Enumerable<BookCreateWithoutAuthorInput> | null;
    connect?: Enumerable<BookWhereUniqueInput> | null;
    set?: Enumerable<BookWhereUniqueInput> | null;
    disconnect?: Enumerable<BookWhereUniqueInput> | null;
    delete?: Enumerable<BookWhereUniqueInput> | null;
    update?: Enumerable<BookUpdateWithWhereUniqueWithoutAuthorInput> | null;
    updateMany?: Enumerable<BookUpdateManyWithWhereNestedInput> | null;
    deleteMany?: Enumerable<BookScalarWhereInput> | null;
    upsert?: Enumerable<BookUpsertWithWhereUniqueWithoutAuthorInput> | null;
};
export declare type AuthorUpdateInput = {
    id?: string | null;
    name?: string | null;
    country?: string | null;
    books?: BookUpdateManyWithoutAuthorInput | null;
};
export declare type AuthorUpdateManyMutationInput = {
    id?: string | null;
    name?: string | null;
    country?: string | null;
};
export declare type AuthorCreateWithoutBooksInput = {
    id?: string | null;
    name: string;
    country: string;
};
export declare type AuthorCreateOneWithoutAuthorInput = {
    create?: AuthorCreateWithoutBooksInput | null;
    connect?: AuthorWhereUniqueInput | null;
};
export declare type BookCreateInput = {
    id?: string | null;
    title: string;
    description: string;
    quantity?: number | null;
    price: number;
    author: AuthorCreateOneWithoutAuthorInput;
};
export declare type AuthorUpdateWithoutBooksDataInput = {
    id?: string | null;
    name?: string | null;
    country?: string | null;
};
export declare type AuthorUpsertWithoutBooksInput = {
    update: AuthorUpdateWithoutBooksDataInput;
    create: AuthorCreateWithoutBooksInput;
};
export declare type AuthorUpdateOneRequiredWithoutBooksInput = {
    create?: AuthorCreateWithoutBooksInput | null;
    connect?: AuthorWhereUniqueInput | null;
    update?: AuthorUpdateWithoutBooksDataInput | null;
    upsert?: AuthorUpsertWithoutBooksInput | null;
};
export declare type BookUpdateInput = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    quantity?: number | null;
    price?: number | null;
    author?: AuthorUpdateOneRequiredWithoutBooksInput | null;
};
export declare type BookUpdateManyMutationInput = {
    id?: string | null;
    title?: string | null;
    description?: string | null;
    quantity?: number | null;
    price?: number | null;
};
export declare type StringFilter = {
    equals?: string | null;
    not?: string | StringFilter | null;
    in?: Enumerable<string> | null;
    notIn?: Enumerable<string> | null;
    lt?: string | null;
    lte?: string | null;
    gt?: string | null;
    gte?: string | null;
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
};
export declare type NullableIntFilter = {
    equals?: number | null | null;
    not?: number | null | NullableIntFilter | null;
    in?: Enumerable<number> | null;
    notIn?: Enumerable<number> | null;
    lt?: number | null;
    lte?: number | null;
    gt?: number | null;
    gte?: number | null;
};
export declare type IntFilter = {
    equals?: number | null;
    not?: number | IntFilter | null;
    in?: Enumerable<number> | null;
    notIn?: Enumerable<number> | null;
    lt?: number | null;
    lte?: number | null;
    gt?: number | null;
    gte?: number | null;
};
export declare type BookFilter = {
    every?: BookWhereInput | null;
    some?: BookWhereInput | null;
    none?: BookWhereInput | null;
};
export declare type UserOrderByInput = {
    id?: OrderByArg | null;
    email?: OrderByArg | null;
    password?: OrderByArg | null;
};
export declare type AuthorOrderByInput = {
    id?: OrderByArg | null;
    name?: OrderByArg | null;
    country?: OrderByArg | null;
};
export declare type BookOrderByInput = {
    id?: OrderByArg | null;
    title?: OrderByArg | null;
    description?: OrderByArg | null;
    quantity?: OrderByArg | null;
    price?: OrderByArg | null;
};
/**
 * Batch Payload for updateMany & deleteMany
 */
export declare type BatchPayload = {
    count: number;
};
/**
 * DMMF
 */
export declare const dmmf: DMMF.Document;
export {};
