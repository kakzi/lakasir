import { useMemberApi } from "@/api/member";
import {
  IMemberFormErrorReponse,
  IMemberFormRequest,
  IMemberFormResponse,
  IMemberResponse,
} from "@/models/member";
import { ErrorResponse, Response } from "@/models/response";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useRef } from "react";
import toast from "react-hot-toast";


export const useMember = () => {
  const dataFetchedRef = useRef(false);
  const router = useRouter();
  const {
    getMemberAction,
    createMemberAction,
    getDetailMemberAction,
    updateMemberAction,
    deleteMemberAction,
  } = useMemberApi();

  const getMember = async (): Promise<
    Response<IMemberResponse[]> | boolean
  > => {
    if (dataFetchedRef.current) return false;
    dataFetchedRef.current = true;
    const toastId = toast.loading("Get member...");
    try {
      const response = await getMemberAction();
      toast.dismiss(toastId);

      return response;
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>;
      console.log(error);
      throw error;
    }
  };

  const createMember = async (
    form: IMemberFormRequest,
    setErrors: (errors: IMemberFormErrorReponse) => void
  ): Promise<Response<IMemberFormResponse>> => {
    const toastId = toast.loading("Creating member...");
    try {
      const response = await createMemberAction(form);
      if (response instanceof AxiosError) {
        throw response;
      }
      const responseDetail = response as Response<IMemberFormResponse>;
      toast.success("Creating member success", { id: toastId });
      router.push("/menu/member");
      return responseDetail;
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>;
      if (error.response) {
        const errorResponse = error.response.data as ErrorResponse;
        const errors = errorResponse.errors as IMemberFormErrorReponse;
        setErrors(errors);
      }
      toast.error("Creating member failed", { id: toastId });
      return {} as Response<IMemberFormErrorReponse>;
    }
  };

  const getDetailMember = async (
    id: number
  ): Promise<Response<IMemberFormResponse> | boolean> => {
    if (dataFetchedRef.current) return false;
    dataFetchedRef.current = true;
    const toastId = toast.loading("Get detail member...");
    try {
      const response = await getDetailMemberAction(id);
      toast.dismiss(toastId);
      return response;
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>;
      throw error;
    }
  };

  const updateMember = async (
    form: IMemberFormRequest,
    id: number,
    setErrors: (errors: IMemberFormErrorReponse) => void
  ): Promise<Response<IMemberFormResponse>> => {
    const toastId = toast.loading("Updating member...");
    try {
      const response = await updateMemberAction(form, id);
      if (response instanceof AxiosError) {
        throw response;
      }
      const responseDetail = response as Response<IMemberFormResponse>;
      toast.success("Update member success", { id: toastId });
      router.push("/menu/member");
      return responseDetail;
    } catch (e) {
      const error = e as AxiosError<ErrorResponse>;
      if (error.response) {
        const errorResponse = error.response.data as ErrorResponse;
        const errors = errorResponse.errors as IMemberFormErrorReponse;
        setErrors(errors);
      }
      toast.error("Creating member failed", { id: toastId });
      return {} as Response<IMemberFormErrorReponse>;
    }
  };

  const deleteMember = async (id: number): Promise<Response<null>> => {
    const toastId = toast.loading("Deleting member...");
    try {
      const response = await deleteMemberAction(id);
      if (response instanceof AxiosError) {
        throw response;
      }
    } catch (e) {
      toast.error("Deleting member failed", { id: toastId });
      throw e;
    }
    toast.success("Delete member success", { id: toastId });
    return {} as Response<null>;
  };


  return {
    getMember,
    createMember,
    getDetailMember,
    updateMember,
    deleteMember,
  };
};
