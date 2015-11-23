
declare namespace ngStorage {
    interface IStorageProvider extends angular.IServiceProvider {
        setKeyPrefix(prefix: string): void;
        setSerializer(s: Function): void;
        setDeserializer(s: Function): void;
        get(key: string): any;
        set(key: string, value: any): void;
    }

    interface ILocalStorageProvider extends IStorageProvider {}
    interface ISessionStorageProvider extends IStorageProvider {}

    interface IStorageService {
        [key: string]: any;
    }
}