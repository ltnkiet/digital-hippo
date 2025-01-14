import { InputFormV2, MDEditor, Select, ButtonV2, Loading } from "components";
import React, { memo, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { validate, getBase64 } from "utils/helpers";
import { toast } from "react-toastify";
import { apiUpdateProduct } from "api";
import { showModal } from "store/app/appSlice";
import { useSelector, useDispatch } from "react-redux";

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
  const { categories, brands } = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const [payload, setPayload] = useState({
    description: '',
  });
  const [preview, setPreview] = useState({
    thumb: null,
    images: [],
  });

  useEffect(() => {
    reset({
      title: editProduct?.title || "",
      price: editProduct?.price || "",
      quantity: editProduct?.quantity || "",
      color: editProduct?.color || "",
      category: editProduct?.category?._id || "",
      brand: editProduct?.brand?._id || "",
    });
    setPayload({
      description:
        typeof editProduct?.description === "object"
          ? editProduct?.description?.join(", ")
          : editProduct?.description,
    });
    setPreview({
      thumb: editProduct?.thumb || "",
      images: editProduct?.images || [],
    });
  }, [editProduct]);

  const [invalidFields, setInvalidFields] = useState([]);
  const changeValue = useCallback(
    (e) => {
      setPayload(e);
    },
    [payload]
  );
  const handlePreviewThumb = async (file) => {
    const base64Thumb = await getBase64(file);
    setPreview((prev) => ({ ...prev, thumb: base64Thumb }));
  };
  const handlePreviewImages = async (files) => {
    const imagesPreview = [];
    for (let file of files) {
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        toast.warning("File not supported!");
        return;
      }
      const base64 = await getBase64(file);
      imagesPreview.push(base64);
    }
    setPreview((prev) => ({ ...prev, images: imagesPreview }));
  };

  useEffect(() => {
    if (watch("thumb") instanceof FileList && watch("thumb").length > 0)
      handlePreviewThumb(watch("thumb")[0]);
  }, [watch("thumb")]);
  useEffect(() => {
    if (watch("images") instanceof FileList && watch("images").length > 0)
      handlePreviewImages(watch("images"));
  }, [watch("images")]);

  const handleUpdateProduct = async (data) => {
    const invalids = validate(payload, setInvalidFields);
    if (invalids === 0) {
      if (data.category)
        data.category = categories?.find((el) => el._id === data.category)?._id;
      if (data.brand)
        data.brand = brands?.find((el) => el._id === data.brand)?._id;
      const finalPayload = { ...data, ...payload };
      finalPayload.thumb =
        data?.thumb?.length === 0 ? preview.thumb : data.thumb[0];
      finalPayload.images =
        data.images?.length === 0 ? preview.images : data.images;

      const formData = new FormData();
      for (let i of Object.entries(finalPayload)) formData.append(i[0], i[1]);
      for (let image of finalPayload.images) formData.append("images", image);

      dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
      const response = await apiUpdateProduct(formData, editProduct._id);
      dispatch(showModal({ isShowModal: false, modalChildren: null }));

      if (response.success) {
        toast.success(response.msg);
        render();
        setEditProduct(null);
      } else toast.error(response.msg);
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 relative">
      <div className="h-[69px] w-full"></div>
      <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0">
        <h1 className="text-3xl font-bold tracking-tight">
          Chỉnh sửa sản phẩm
        </h1>
        <span
          className="text-main hover:underline cursor-pointer"
          onClick={() => setEditProduct(null)}>
          Hủy
        </span>
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <InputFormV2
            label="Tên sản phẩm"
            register={register}
            errors={errors}
            id="title"
            validate={{
              required: "Vui lòng nhập thông tin",
            }}
            fullWidth
            placeholder="Nhập tên"
          />
          <div className="w-full my-6 flex gap-4">
          <InputFormV2
              label="Giá"
              register={register}
              errors={errors}
              id="price"
              validate={{
                required: "Vui lòng nhập thông tin",
                min: { value: 0, message: "Số lượng không được âm" }, 
              }}
              style="flex-auto"
              placeholder="Nhập giá sản phẩm"
              type="number"
            />
            <InputFormV2
              label="Số lượng"
              register={register}
              errors={errors}
              id="quantity"
              validate={{
                required: "Vui lòng nhập thông tin",
                min: { value: 0, message: "Số lượng không được âm" },
              }}
              style="flex-auto"
              placeholder="Nhập số lượng sản phẩm"
              type="number"
            />
            <InputFormV2
              label="Màu sản phẩm"
              register={register}
              errors={errors}
              id="color"
              validate={{
                required: "Vui lòng nhập thông tin",
              }}
              style="flex-auto"
              placeholder="Nhập màu"
            />
          </div>
          <div className="w-full my-6 flex gap-4">
            <Select
              label="Danh mục"
              options={categories?.map((el) => ({
                code: el._id,
                value: el.name,
              }))}
              register={register}
              id="category"
              validate={{ required: "Vui lòng chọn thông tin" }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
            <Select
              label="Thương hiệu"
              options={brands?.map((el) => ({
                code: el._id,
                value: el.name,
              }))}
              register={register}
              id="brand"
              validate={{ required: "Vui lòng chọn thông tin" }}
              style="flex-auto"
              errors={errors}
              fullWidth
            />
          </div>
          <div className="w-full my-6">
            <MDEditor
              label="Mô tả"
              name="description"
              changeValue={changeValue}
              invalidFields={invalidFields}
              setInvalidFields={setInvalidFields}
              value={payload.description}
            />
          </div>
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="thumb">
              Ảnh bìa
            </label>
            <input type="file" id="thumb" {...register("thumb")} />
            {errors["thumb"] && (
              <small className="text-xs text-red-500">
                {errors["thumb"]?.message}
              </small>
            )}
          </div>
          {preview.thumb && (
            <div className="my-4">
              <img
                src={preview.thumb}
                alt="thumbnail"
                className="w-[200px] object-contain"
              />
            </div>
          )}
          <div className="flex flex-col gap-2 mt-8">
            <label className="font-semibold" htmlFor="products">
              Ảnh chi tiết
            </label>
            <input type="file" id="products" multiple {...register("images")} />
            {errors["images"] && (
              <small className="text-xs text-red-500">
                {errors["images"]?.message}
              </small>
            )}
          </div>
          {preview.images.length > 0 && (
            <div className="my-4 flex w-full gap-3 flex-wrap">
              {preview.images?.map((el, idx) => (
                <div key={idx} className="w-fit relative">
                  <img
                    src={el}
                    alt="product"
                    className="w-[200px] object-contain"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="my-6">
            <ButtonV2 type="submit">Lưu</ButtonV2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(UpdateProduct);
