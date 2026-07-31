export abstract class BaseMapper<TData, TDomain> {
  public abstract toDomain(data: TData): TDomain;
  public abstract toData(data: TDomain): TData;
}
