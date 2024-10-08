import { Button, Space, Table, TableColumnsType, TableProps } from "antd";
import { academicManagementApi } from "../../../redux/features/Admin/academicManagement.api";
import { TAcademicSemester } from "../../../types/academicManagement.type";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { toast } from "sonner";
import UpdateAcademicSemester from "./UpdateAcademicSemester";

export type TTableData = Pick<
  TAcademicSemester,
  "name" | "startMonth" | "endMonth" | "year"
>;

const AcademicSemester = () => {
  const [params, setParams] = useState<TQueryParam[] | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<TTableData | null>(
    null
  );

  const {
    data: semesterData,
    isLoading,
    isFetching,
  } = academicManagementApi.useGetAllSemestersQuery(params);

  const [deleteAcademicSemester] =
    academicManagementApi.useDeleteAcademicSemesterMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteAcademicSemester(id).unwrap();
      toast.success("Academic Semester deleted successfully!", {
        position: "top-center",
      });
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Failed to delete Academic Semester.";
      toast.error(errorMessage, { position: "top-center" });
    }
  };

  const handleUpdate = (semester: TTableData) => {
    setSelectedSemester(semester);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const tableData = semesterData?.data?.map(
    ({ _id, name, startMonth, endMonth, year }) => ({
      key: _id,
      name,
      startMonth,
      endMonth,
      year,
    })
  );

  const columns: TableColumnsType<TTableData> = [
    {
      title: "Name",
      dataIndex: "name",
      filters: [
        { text: "Fall", value: "Fall" },
        { text: "Summer", value: "Summer" },
        { text: "Autumn", value: "Autumn" },
      ],
    },
    {
      title: "Year",
      dataIndex: "year",
      filters: [
        { text: "2024", value: "2024" },
        { text: "2025", value: "2025" },
        { text: "2026", value: "2026" },
      ],
    },
    {
      title: "Start Month",
      dataIndex: "startMonth",
    },
    {
      title: "End Month",
      dataIndex: "endMonth",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
          <Space size="middle">
            <Button onClick={() => handleUpdate(item)}>Update</Button>
            <Button onClick={() => handleDelete(item.key)}>Delete</Button>
          </Space>
        );
      },
      width: "15%",
    },
  ];

  const onChange: TableProps<TTableData>["onChange"] = (
    _pagination,
    filters,
    _sorter,
    extra
  ) => {
    if (extra.action === "filter") {
      const queryParams: TQueryParam[] = [];
      filters.name?.forEach((item) =>
        queryParams.push({ name: "name", value: item })
      );
      filters.year?.forEach((item) =>
        queryParams.push({ name: "year", value: item })
      );
      setParams(queryParams);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        onChange={onChange}
        scroll={{ x: "max-content" }}
        showSorterTooltip={{ target: "sorter-icon" }}
      />

      <UpdateAcademicSemester
        isOpen={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        semester={selectedSemester}
      />
    </div>
  );
};

export default AcademicSemester;
