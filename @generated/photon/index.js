"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime");
/**
 * Query Engine version: latest
 */
const path = require("path");
const debug = runtime_1.debugLib('photon');
class PhotonFetcher {
    constructor(photon, engine, debug = false, hooks) {
        this.photon = photon;
        this.engine = engine;
        this.debug = debug;
        this.hooks = hooks;
    }
    request(document, path = [], rootField, typeName, isList, callsite) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = String(document);
            debug('Request:');
            debug(query);
            if (this.hooks && this.hooks.beforeRequest) {
                this.hooks.beforeRequest({ query, path, rootField, typeName, document });
            }
            try {
                yield this.photon.connect();
                const result = yield this.engine.request(query, typeName);
                debug('Response:');
                debug(result);
                return this.unpack(result, path, rootField, isList);
            }
            catch (e) {
                if (callsite) {
                    const { stack } = runtime_1.printStack({
                        callsite,
                        originalMethod: path.join('.'),
                        onUs: e.isPanic
                    });
                    throw new Error(stack + '\n\n' + e.message);
                }
                else {
                    if (e.isPanic) {
                        throw e;
                    }
                    else {
                        throw new Error(`Error in Photon${path}: \n` + e.stack);
                    }
                }
            }
        });
    }
    unpack(data, path, rootField, isList) {
        const getPath = [];
        if (rootField) {
            getPath.push(rootField);
        }
        getPath.push(...path.filter(p => p !== 'select' && p !== 'include'));
        const result = runtime_1.deepGet(data, getPath) || null;
        if (result === null && isList) {
            return [];
        }
        return result;
    }
}
/**
 * Build tool annotations
 * In order to make `ncc` and `node-file-trace` happy.
**/
path.join(__dirname, 'runtime/query-engine-linux-glibc-libssl1.1.0');
class Photon {
    constructor(options = {}) {
        const useDebug = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.library) : false;
        if (useDebug) {
            runtime_1.debugLib.enable('photon');
        }
        const debugEngine = options.debug === true ? true : typeof options.debug === 'object' ? Boolean(options.debug.engine) : false;
        // datamodel = datamodel without datasources + printed datasources
        this.datamodel = "datasource db {\n  provider = \"sqlite\"\n  url      = \"file:dev.db\"\n}\n\ngenerator photon {\n  provider = \"photonjs\"\n  output   = \"../@generated/photon\"\n}\n\nmodel User {\n  id       String @default(cuid()) @id @unique\n  email    String @unique\n  password String\n}\n\nmodel Author {\n  id      String @default(cuid()) @id @unique\n  name    String\n  country String\n  books   Book[]\n}\n\nmodel Book {\n  id          String @default(cuid()) @id @unique\n  title       String\n  description String\n  quantity    Int?   @default(0)\n  author      Author\n  price       Int\n}";
        const predefinedDatasources = [
            {
                "name": "db",
                "url": 'file:' + path.resolve(__dirname, '../../prisma/dev.db')
            }
        ];
        const inputDatasources = Object.entries(options.datasources || {}).map(([name, url]) => ({ name, url: url }));
        const datasources = runtime_1.mergeBy(predefinedDatasources, inputDatasources, (source) => source.name);
        const internal = options.__internal || {};
        const engineConfig = internal.engine || {};
        this.engine = new runtime_1.Engine({
            cwd: engineConfig.cwd || path.resolve(__dirname, "../../prisma"),
            debug: debugEngine,
            datamodel: this.datamodel,
            prismaPath: engineConfig.binaryPath || undefined,
            datasources,
            generator: { "name": "photon", "provider": "photonjs", "output": "/home/josh/Documentos/Nodejs/api-rest-bookstore/@generated/photon", "binaryTargets": [], "config": {} },
        });
        this.dmmf = new runtime_1.DMMFClass(exports.dmmf);
        this.fetcher = new PhotonFetcher(this, this.engine, false, internal.hooks);
    }
    connectEngine(publicCall) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.engine.start();
        });
    }
    connect() {
        if (this.connectionPromise) {
            return this.connectionPromise;
        }
        this.connectionPromise = this.connectEngine(true);
        return this.connectionPromise;
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.engine.stop();
        });
    }
    // won't be generated for now
    // private _query?: QueryDelegate
    // get query(): QueryDelegate {
    //   return this._query ? this._query: (this._query = QueryDelegate(this.dmmf, this.fetcher))
    // }
    get users() {
        return UserDelegate(this.dmmf, this.fetcher);
    }
    get authors() {
        return AuthorDelegate(this.dmmf, this.fetcher);
    }
    get books() {
        return BookDelegate(this.dmmf, this.fetcher);
    }
}
exports.Photon = Photon;
/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }
exports.OrderByArg = makeEnum({
    asc: 'asc',
    desc: 'desc'
});
function UserDelegate(dmmf, fetcher) {
    const User = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users', args, []);
    User.findOne = (args) => args.select ? new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []) : new UserClient(dmmf, fetcher, 'query', 'findOneUser', 'users.findOne', args, []);
    User.findMany = (args) => new UserClient(dmmf, fetcher, 'query', 'findManyUser', 'users.findMany', args, []);
    User.create = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'createOneUser', 'users.create', args, []);
    User.delete = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'deleteOneUser', 'users.delete', args, []);
    User.update = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'updateOneUser', 'users.update', args, []);
    User.deleteMany = (args) => new UserClient(dmmf, fetcher, 'mutation', 'deleteManyUser', 'users.deleteMany', args, []);
    User.updateMany = (args) => new UserClient(dmmf, fetcher, 'mutation', 'updateManyUser', 'users.updateMany', args, []);
    User.upsert = (args) => args.select ? new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []) : new UserClient(dmmf, fetcher, 'mutation', 'upsertOneUser', 'users.upsert', args, []);
    User.count = () => new UserClient(dmmf, fetcher, 'query', 'aggregateUser', 'users.count', {}, ['count']);
    return User; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class UserClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'User', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.UserClient = UserClient;
function AuthorDelegate(dmmf, fetcher) {
    const Author = (args) => new AuthorClient(dmmf, fetcher, 'query', 'findManyAuthor', 'authors', args, []);
    Author.findOne = (args) => args.select ? new AuthorClient(dmmf, fetcher, 'query', 'findOneAuthor', 'authors.findOne', args, []) : new AuthorClient(dmmf, fetcher, 'query', 'findOneAuthor', 'authors.findOne', args, []);
    Author.findMany = (args) => new AuthorClient(dmmf, fetcher, 'query', 'findManyAuthor', 'authors.findMany', args, []);
    Author.create = (args) => args.select ? new AuthorClient(dmmf, fetcher, 'mutation', 'createOneAuthor', 'authors.create', args, []) : new AuthorClient(dmmf, fetcher, 'mutation', 'createOneAuthor', 'authors.create', args, []);
    Author.delete = (args) => args.select ? new AuthorClient(dmmf, fetcher, 'mutation', 'deleteOneAuthor', 'authors.delete', args, []) : new AuthorClient(dmmf, fetcher, 'mutation', 'deleteOneAuthor', 'authors.delete', args, []);
    Author.update = (args) => args.select ? new AuthorClient(dmmf, fetcher, 'mutation', 'updateOneAuthor', 'authors.update', args, []) : new AuthorClient(dmmf, fetcher, 'mutation', 'updateOneAuthor', 'authors.update', args, []);
    Author.deleteMany = (args) => new AuthorClient(dmmf, fetcher, 'mutation', 'deleteManyAuthor', 'authors.deleteMany', args, []);
    Author.updateMany = (args) => new AuthorClient(dmmf, fetcher, 'mutation', 'updateManyAuthor', 'authors.updateMany', args, []);
    Author.upsert = (args) => args.select ? new AuthorClient(dmmf, fetcher, 'mutation', 'upsertOneAuthor', 'authors.upsert', args, []) : new AuthorClient(dmmf, fetcher, 'mutation', 'upsertOneAuthor', 'authors.upsert', args, []);
    Author.count = () => new AuthorClient(dmmf, fetcher, 'query', 'aggregateAuthor', 'authors.count', {}, ['count']);
    return Author; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class AuthorClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    books(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'books'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = true;
        return new BookClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Author', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Author', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Author', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.AuthorClient = AuthorClient;
function BookDelegate(dmmf, fetcher) {
    const Book = (args) => new BookClient(dmmf, fetcher, 'query', 'findManyBook', 'books', args, []);
    Book.findOne = (args) => args.select ? new BookClient(dmmf, fetcher, 'query', 'findOneBook', 'books.findOne', args, []) : new BookClient(dmmf, fetcher, 'query', 'findOneBook', 'books.findOne', args, []);
    Book.findMany = (args) => new BookClient(dmmf, fetcher, 'query', 'findManyBook', 'books.findMany', args, []);
    Book.create = (args) => args.select ? new BookClient(dmmf, fetcher, 'mutation', 'createOneBook', 'books.create', args, []) : new BookClient(dmmf, fetcher, 'mutation', 'createOneBook', 'books.create', args, []);
    Book.delete = (args) => args.select ? new BookClient(dmmf, fetcher, 'mutation', 'deleteOneBook', 'books.delete', args, []) : new BookClient(dmmf, fetcher, 'mutation', 'deleteOneBook', 'books.delete', args, []);
    Book.update = (args) => args.select ? new BookClient(dmmf, fetcher, 'mutation', 'updateOneBook', 'books.update', args, []) : new BookClient(dmmf, fetcher, 'mutation', 'updateOneBook', 'books.update', args, []);
    Book.deleteMany = (args) => new BookClient(dmmf, fetcher, 'mutation', 'deleteManyBook', 'books.deleteMany', args, []);
    Book.updateMany = (args) => new BookClient(dmmf, fetcher, 'mutation', 'updateManyBook', 'books.updateMany', args, []);
    Book.upsert = (args) => args.select ? new BookClient(dmmf, fetcher, 'mutation', 'upsertOneBook', 'books.upsert', args, []) : new BookClient(dmmf, fetcher, 'mutation', 'upsertOneBook', 'books.upsert', args, []);
    Book.count = () => new BookClient(dmmf, fetcher, 'query', 'aggregateBook', 'books.count', {}, ['count']);
    return Book; // any needed until https://github.com/microsoft/TypeScript/issues/31335 is resolved
}
class BookClient {
    constructor(_dmmf, _fetcher, _queryType, _rootField, _clientMethod, _args, _path, _isList = false) {
        this._dmmf = _dmmf;
        this._fetcher = _fetcher;
        this._queryType = _queryType;
        this._rootField = _rootField;
        this._clientMethod = _clientMethod;
        this._args = _args;
        this._path = _path;
        this._isList = _isList;
        // @ts-ignore
        if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
            const error = new Error();
            if (error && error.stack) {
                const stack = error.stack;
                this._callsite = stack;
            }
        }
    }
    author(args) {
        const prefix = this._path.includes('select') ? 'select' : this._path.includes('include') ? 'include' : 'select';
        const path = [...this._path, prefix, 'author'];
        const newArgs = runtime_1.deepSet(this._args, path, args || true);
        this._isList = false;
        return new AuthorClient(this._dmmf, this._fetcher, this._queryType, this._rootField, this._clientMethod, newArgs, path, this._isList);
    }
    get _document() {
        const { _rootField: rootField } = this;
        const document = runtime_1.makeDocument({
            dmmf: this._dmmf,
            rootField,
            rootTypeName: this._queryType,
            select: this._args
        });
        try {
            document.validate(this._args, false, this._clientMethod);
        }
        catch (e) {
            const x = e;
            if (x.render) {
                if (this._callsite) {
                    e.message = x.render(this._callsite);
                }
            }
            throw e;
        }
        return runtime_1.transformDocument(document);
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Book', this._isList, this._callsite);
        }
        return this._requestPromise.then(onfulfilled, onrejected);
    }
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch(onrejected) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Book', this._isList, this._callsite);
        }
        return this._requestPromise.catch(onrejected);
    }
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally) {
        if (!this._requestPromise) {
            this._requestPromise = this._fetcher.request(this._document, this._path, this._rootField, 'Book', this._isList, this._callsite);
        }
        return this._requestPromise.finally(onfinally);
    }
}
exports.BookClient = BookClient;
/**
 * DMMF
 */
exports.dmmf = { "datamodel": { "enums": [], "models": [{ "name": "User", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "email", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "password", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }, { "name": "Author", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "name", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "country", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "books", "kind": "object", "dbName": null, "isList": true, "isRequired": false, "isUnique": false, "isId": false, "type": "Book", "relationName": "AuthorToBook", "relationToFields": [], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }, { "name": "Book", "isEmbedded": false, "dbName": null, "fields": [{ "name": "id", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": true, "isId": true, "type": "String", "default": { "name": "cuid", "returnType": "String", "args": [] }, "isGenerated": false, "isUpdatedAt": false }, { "name": "title", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "description", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "String", "isGenerated": false, "isUpdatedAt": false }, { "name": "quantity", "kind": "scalar", "dbName": null, "isList": false, "isRequired": false, "isUnique": false, "isId": false, "type": "Int", "default": 0, "isGenerated": false, "isUpdatedAt": false }, { "name": "author", "kind": "object", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Author", "relationName": "AuthorToBook", "relationToFields": ["id"], "relationOnDelete": "NONE", "isGenerated": false, "isUpdatedAt": false }, { "name": "price", "kind": "scalar", "dbName": null, "isList": false, "isRequired": true, "isUnique": false, "isId": false, "type": "Int", "isGenerated": false, "isUpdatedAt": false }], "isGenerated": false, "idFields": [] }] }, "mappings": [{ "model": "User", "plural": "users", "findOne": "findOneUser", "findMany": "findManyUser", "create": "createOneUser", "delete": "deleteOneUser", "update": "updateOneUser", "deleteMany": "deleteManyUser", "updateMany": "updateManyUser", "upsert": "upsertOneUser", "aggregate": "aggregateUser" }, { "model": "Author", "plural": "authors", "findOne": "findOneAuthor", "findMany": "findManyAuthor", "create": "createOneAuthor", "delete": "deleteOneAuthor", "update": "updateOneAuthor", "deleteMany": "deleteManyAuthor", "updateMany": "updateManyAuthor", "upsert": "upsertOneAuthor", "aggregate": "aggregateAuthor" }, { "model": "Book", "plural": "books", "findOne": "findOneBook", "findMany": "findManyBook", "create": "createOneBook", "delete": "deleteOneBook", "update": "updateOneBook", "deleteMany": "deleteManyBook", "updateMany": "updateManyBook", "upsert": "upsertOneBook", "aggregate": "aggregateBook" }], "schema": { "enums": [{ "name": "OrderByArg", "values": ["asc", "desc"] }], "outputTypes": [{ "name": "User", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "email", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "password", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregateUser", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Book", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "title", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "description", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "quantity", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": false, "isList": false } }, { "name": "author", "args": [], "outputType": { "type": "Author", "kind": "object", "isRequired": true, "isList": false } }, { "name": "price", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Author", "fields": [{ "name": "id", "args": [], "outputType": { "type": "ID", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "name", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "country", "args": [], "outputType": { "type": "String", "kind": "scalar", "isRequired": true, "isList": false } }, { "name": "books", "args": [{ "name": "where", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "BookOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": false, "isList": true } }] }, { "name": "AggregateAuthor", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "AggregateBook", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Query", "fields": [{ "name": "findManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "UserOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregateUser", "args": [], "outputType": { "type": "AggregateUser", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyAuthor", "args": [{ "name": "where", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "AuthorOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Author", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregateAuthor", "args": [], "outputType": { "type": "AggregateAuthor", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneAuthor", "args": [{ "name": "where", "inputType": [{ "type": "AuthorWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Author", "kind": "object", "isRequired": false, "isList": false } }, { "name": "findManyBook", "args": [{ "name": "where", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "orderBy", "inputType": [{ "isList": false, "isRequired": false, "type": "BookOrderByInput", "kind": "object" }] }, { "name": "skip", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "after", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "before", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "first", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "last", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": false, "isList": true } }, { "name": "aggregateBook", "args": [], "outputType": { "type": "AggregateBook", "kind": "object", "isRequired": true, "isList": false } }, { "name": "findOneBook", "args": [{ "name": "where", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": false, "isList": false } }] }, { "name": "BatchPayload", "fields": [{ "name": "count", "args": [], "outputType": { "type": "Int", "kind": "scalar", "isRequired": true, "isList": false } }] }, { "name": "Mutation", "fields": [{ "name": "createOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "UserCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "UserUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "User", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyUser", "args": [{ "name": "data", "inputType": [{ "type": "UserUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyUser", "args": [{ "name": "where", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOneAuthor", "args": [{ "name": "data", "inputType": [{ "type": "AuthorCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Author", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneAuthor", "args": [{ "name": "where", "inputType": [{ "type": "AuthorWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Author", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneAuthor", "args": [{ "name": "data", "inputType": [{ "type": "AuthorUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "AuthorWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Author", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneAuthor", "args": [{ "name": "where", "inputType": [{ "type": "AuthorWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "AuthorCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "AuthorUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Author", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyAuthor", "args": [{ "name": "data", "inputType": [{ "type": "AuthorUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyAuthor", "args": [{ "name": "where", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "createOneBook", "args": [{ "name": "data", "inputType": [{ "type": "BookCreateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteOneBook", "args": [{ "name": "where", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": false, "isList": false } }, { "name": "updateOneBook", "args": [{ "name": "data", "inputType": [{ "type": "BookUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": false, "isList": false } }, { "name": "upsertOneBook", "args": [{ "name": "where", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "BookCreateInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "BookUpdateInput", "kind": "object", "isRequired": true, "isList": false }] }], "outputType": { "type": "Book", "kind": "object", "isRequired": true, "isList": false } }, { "name": "updateManyBook", "args": [{ "name": "data", "inputType": [{ "type": "BookUpdateManyMutationInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "where", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }, { "name": "deleteManyBook", "args": [{ "name": "where", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": false }] }], "outputType": { "type": "BatchPayload", "kind": "object", "isRequired": true, "isList": false } }] }], "inputTypes": [{ "name": "UserWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "email", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "password", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "UserWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "UserWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "BookWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "description", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "quantity", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "NullableIntFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "price", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "IntFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "BookWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "author", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": false }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "AuthorWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "country", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "books", "inputType": [{ "type": "BookFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "AuthorWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "AuthorWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "BookWhereUniqueInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }], "atLeastOne": true }, { "name": "UserCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "UserUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "UserUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "email", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "password", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "BookCreateWithoutAuthorInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "description", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "quantity", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "price", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "BookCreateManyWithoutBooksInput", "fields": [{ "name": "create", "inputType": [{ "type": "BookCreateWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "AuthorCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "country", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "books", "inputType": [{ "type": "BookCreateManyWithoutBooksInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "BookUpdateWithoutAuthorDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "description", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "quantity", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "price", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "BookUpdateWithWhereUniqueWithoutAuthorInput", "fields": [{ "name": "where", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "BookUpdateWithoutAuthorDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "BookScalarWhereInput", "fields": [{ "name": "id", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "description", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "type": "StringFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "quantity", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "NullableIntFilter", "isList": false, "isRequired": false, "kind": "object" }, { "type": "null", "isList": false, "isRequired": false, "kind": "scalar" }], "isRelationFilter": false }, { "name": "price", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "type": "IntFilter", "isList": false, "isRequired": false, "kind": "object" }], "isRelationFilter": false }, { "name": "AND", "inputType": [{ "type": "BookScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "OR", "inputType": [{ "type": "BookScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }, { "name": "NOT", "inputType": [{ "type": "BookScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }], "isRelationFilter": true }], "isWhereType": true, "atLeastOne": false }, { "name": "BookUpdateManyDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "description", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "quantity", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "price", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "BookUpdateManyWithWhereNestedInput", "fields": [{ "name": "where", "inputType": [{ "type": "BookScalarWhereInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "data", "inputType": [{ "type": "BookUpdateManyDataInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "BookUpsertWithWhereUniqueWithoutAuthorInput", "fields": [{ "name": "where", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "update", "inputType": [{ "type": "BookUpdateWithoutAuthorDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "BookCreateWithoutAuthorInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "BookUpdateManyWithoutAuthorInput", "fields": [{ "name": "create", "inputType": [{ "type": "BookCreateWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "connect", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "set", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "disconnect", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "delete", "inputType": [{ "type": "BookWhereUniqueInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "update", "inputType": [{ "type": "BookUpdateWithWhereUniqueWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "updateMany", "inputType": [{ "type": "BookUpdateManyWithWhereNestedInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "deleteMany", "inputType": [{ "type": "BookScalarWhereInput", "kind": "object", "isRequired": false, "isList": true }] }, { "name": "upsert", "inputType": [{ "type": "BookUpsertWithWhereUniqueWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": true }] }] }, { "name": "AuthorUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "country", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "books", "inputType": [{ "type": "BookUpdateManyWithoutAuthorInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "AuthorUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "country", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "AuthorCreateWithoutBooksInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "country", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }] }, { "name": "AuthorCreateOneWithoutAuthorInput", "fields": [{ "name": "create", "inputType": [{ "type": "AuthorCreateWithoutBooksInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "AuthorWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "BookCreateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "description", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "quantity", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "price", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": true, "isList": false }] }, { "name": "author", "inputType": [{ "type": "AuthorCreateOneWithoutAuthorInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "AuthorUpdateWithoutBooksDataInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "name", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "country", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "AuthorUpsertWithoutBooksInput", "fields": [{ "name": "update", "inputType": [{ "type": "AuthorUpdateWithoutBooksDataInput", "kind": "object", "isRequired": true, "isList": false }] }, { "name": "create", "inputType": [{ "type": "AuthorCreateWithoutBooksInput", "kind": "object", "isRequired": true, "isList": false }] }] }, { "name": "AuthorUpdateOneRequiredWithoutBooksInput", "fields": [{ "name": "create", "inputType": [{ "type": "AuthorCreateWithoutBooksInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "connect", "inputType": [{ "type": "AuthorWhereUniqueInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "update", "inputType": [{ "type": "AuthorUpdateWithoutBooksDataInput", "kind": "object", "isRequired": false, "isList": false }] }, { "name": "upsert", "inputType": [{ "type": "AuthorUpsertWithoutBooksInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "BookUpdateInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "description", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "quantity", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "price", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "author", "inputType": [{ "type": "AuthorUpdateOneRequiredWithoutBooksInput", "kind": "object", "isRequired": false, "isList": false }] }] }, { "name": "BookUpdateManyMutationInput", "fields": [{ "name": "id", "inputType": [{ "type": "ID", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "title", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "description", "inputType": [{ "type": "String", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "quantity", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }, { "name": "price", "inputType": [{ "type": "Int", "kind": "scalar", "isRequired": false, "isList": false }] }] }, { "name": "StringFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "StringFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "contains", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "startsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }, { "name": "endsWith", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "String" }] }], "atLeastOne": false }, { "name": "NullableIntFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "null" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "NullableIntFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }], "atLeastOne": false }, { "name": "IntFilter", "fields": [{ "name": "equals", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "not", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }, { "isList": false, "isRequired": false, "kind": "scalar", "type": "IntFilter" }] }, { "name": "in", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "notIn", "inputType": [{ "isList": true, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "lte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gt", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }, { "name": "gte", "inputType": [{ "isList": false, "isRequired": false, "kind": "scalar", "type": "Int" }] }], "atLeastOne": false }, { "name": "BookFilter", "fields": [{ "name": "every", "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "BookWhereInput" }] }, { "name": "some", "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "BookWhereInput" }] }, { "name": "none", "inputType": [{ "isList": false, "isRequired": false, "kind": "object", "type": "BookWhereInput" }] }], "atLeastOne": false }, { "name": "UserOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "email", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "password", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "AuthorOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "name", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "country", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }, { "name": "BookOrderByInput", "atLeastOne": true, "atMostOne": true, "isOrderType": true, "fields": [{ "name": "id", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "title", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "description", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "quantity", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }, { "name": "price", "inputType": [{ "type": "OrderByArg", "isList": false, "isRequired": false, "kind": "enum" }], "isRelationFilter": false }] }] } };
