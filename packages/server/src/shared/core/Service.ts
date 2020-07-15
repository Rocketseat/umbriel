export default interface Service<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
