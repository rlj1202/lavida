export default interface IPagination<T> {
    offset: number;
    limit: number;
    count: number;
    total: number;
    items: T[];
}