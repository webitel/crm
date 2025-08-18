import {
  WebitelCasesRelationType,
  WebitelCasesSourceType,
  WebitelContactsGroupType,
} from '@webitel/api-services/gen/models';
import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';

import { SearchMode } from '../../../modules/cases/enums/SearchMode.ts';
import AccessMode from '../../../modules/contacts/modules/permissions/enums/AccessMode.enum.js';
import { TimelineEventType } from '../../../modules/timeline/enums/TimelineEventType';
import TimelineTaskStatusEnum from '../../../modules/timeline/enums/TimelineTaskStatus.enum.js';

export default {
  crm: 'CRM',
  contacts: {
    contact: 'Liên hệ | Danh bạ',
    manager: 'Chủ sở hữu | Chủ sở hữu',
    destination: 'Đích đến',
    collapseAll: 'Thu gọn tất cả',
    allContacts: ({ linked }) =>
      `${linked('reusable.all')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    addContacts: ({ linked }) =>
      `${linked('reusable.add')} ${linked(`vocabulary.contact`).toLowerCase()}`,
    communications: {
      communications: 'Tùy chọn liên lạc | Tùy chọn liên lạc',
      channel: 'Kênh',
      destination: 'Đích đến',
      setAsPrimary: 'Đặt làm mặc định',
      emails: {
        addTitle: 'Thêm email',
        editTitle: 'Sửa email',
        dummy: 'Chưa có địa chỉ email nào',
      },
      phones: {
        addTitle: 'Thêm số điện thoại',
        editTitle: 'Sửa số điện thoại',
        dummy: 'Chưa có số điện thoại nào',
      },
      messaging: {
        gateway: 'Cổng kết nối',
        provider: 'Nhà cung cấp ',
        username: 'Tên người dùng',
        dummy: 'Chưa có tùy chọn nhắn tin nào',
        messengers: {
          [ChatGatewayProvider.TELEGRAM_BOT]: 'Telegram Bot',
          [ChatGatewayProvider.TELEGRAM_APP]: 'Ứng dụng Telegram',
          [ChatGatewayProvider.MESSENGER]: 'Meta',
          [ChatGatewayProvider.VIBER]: 'Viber',
          [ChatGatewayProvider.WEBCHAT]: 'Web chat',
          [ChatGatewayProvider.INFOBIP]: 'Infobip',
          [ChatGatewayProvider.CUSTOM]: 'Cổng chat tùy chỉnh',
        },
      },
    },
    details: 'Chi tiết',
    attributes: 'Thuộc tính | Thuộc tính',
  },
  timeline: {
    timeline: 'Dòng thời gian',
    totalDuration: 'Tổng thời gian',
    actions: {
      openInHistory: 'Mở trong lịch sử',
      playRecording: 'Phát bản ghi',
      transcription: 'Bản ghi âm',
    },
    status: {
      [TimelineTaskStatusEnum.STARTED]: 'Đã bắt đầu',
      [TimelineTaskStatusEnum.MISSED]: 'Bỏ lỡ',
      [TimelineTaskStatusEnum.TRANSFERRED]: 'Đã chuyển',
      [TimelineTaskStatusEnum.ENDED]: 'Đã kết thúc',
      [TimelineTaskStatusEnum.SENT]: 'Đã gửi',
      [TimelineTaskStatusEnum.RECEIVED]: 'Đã nhận',
    },
    eventType: {
      [TimelineEventType.Call]: 'Cuộc gọi | Cuộc gọi',
      [TimelineEventType.Chat]: 'Trò chuyện | Trò chuyện',
      [TimelineEventType.Email]: 'Email | Email',
    },
    emails: {
      to: 'Đến',
      cc: 'CC',
      subject: 'Chủ đề',
    },
  },
  permissions: {
    read: 'Đọc',
    edit: 'Sửa',
    delete: 'Xóa',
    granteePopup: {
      title: 'Thêm người được cấp quyền',
    },
    accessMode: {
      [AccessMode.ALLOW]: 'Cho phép',
      [AccessMode.FORBIDDEN]: 'Cấm',
      [AccessMode.MANAGE]: 'Cho phép với ủy quyền',
    },
  },
  startPage: {
    [CrmSections.CONTACTS]: {
      name: 'Danh bạ',
      text: 'Trong phần này, bạn có thể làm việc với danh bạ của mình: khách hàng, đối tác, v.v.',
    },
    [CrmSections.CASES]: {
      name: 'Vụ việc',
      text: 'Ở đây bạn có thể xem các Vụ việc đã đăng ký trong hệ thống.',
    },
    configuration: {
      name: 'Cấu hình',
      text: 'Trong phần này, bạn sẽ thiết lập quy trình quản lý Vụ việc.',
    },
  },
  lookups: {
    lookups: 'Tra cứu',

    slas: {
      slas: 'SLA | SLA',
      conditions: 'Điều kiện | Điều kiện',
      editCondition: 'Sửa điều kiện',
      addCondition: 'Thêm điều kiện',
      reactionTime: 'Thời gian phản hồi',
      reactionTimeTitle: 'Thời gian phản hồi (dd:hh:mm)',
      resolutionTime: 'Thời gian giải quyết',
      resolutionTimeTitle: 'Thời gian giải quyết (dd:hh:mm)',
      validFrom: 'Có hiệu lực từ',
      validTo: 'Có hiệu lực đến',
    },

    sources: {
      sources: 'Nguồn vụ việc | Nguồn vụ việc',
      types: {
        [WebitelCasesSourceType.Call]: 'Cuộc gọi',
        [WebitelCasesSourceType.Chat]: 'Trò chuyện',
        [WebitelCasesSourceType.SocialMedia]: 'Mạng xã hội',
        [WebitelCasesSourceType.Email]: 'Email',
        [WebitelCasesSourceType.Api]: 'API',
        [WebitelCasesSourceType.Manual]: 'Thủ công',
      },
    },

    serviceCatalogs: {
      serviceCatalogs: 'Danh mục dịch vụ | Danh mục dịch vụ',
      prefix: 'Tiền tố',
      code: 'Mã',
      statuses: ({ linked }) => linked(`lookups.statuses.statuses`, 2),
      skills: 'Kỹ năng',
    },

    service: {
      service: 'Dịch vụ | Dịch vụ',
    },

    contactGroups: {
      contactGroups: 'Nhóm liên hệ | Nhóm liên hệ',
      defaultGroup: 'Nhóm mặc định',
      addGroup: 'Thêm nhóm',
      assignee: 'Người được giao',
      types: {
        [WebitelContactsGroupType.Dynamic]: 'Động',
        [WebitelContactsGroupType.Static]: 'Tĩnh',
      },
    },

    closeReasonGroups: {
      closeReasonGroups: 'Lý do đóng',
      reason: 'Lý do | Lý do',
      addReason: 'Thêm lý do',
      editReason: 'Sửa lý do',
      sameConditionError: 'Điều kiện này đã tồn tại',
    },

    statuses: {
      statuses: 'Trạng thái | Trạng thái',
      initial: 'Ban đầu',
      final: 'Cuối cùng',
      addStatus: ({ linked }) =>
        `${linked('reusable.add')} ${linked(
          `lookups.statuses.statuses`,
          1,
        ).toLowerCase()}`,
      editStatus: ({ linked }) =>
        `${linked('reusable.edit')} ${linked(
          `lookups.statuses.statuses`,
          1,
        ).toLowerCase()}`,
      statusType: 'Loại trạng thái',
      finalStatusValidationText:
        'Bạn cần có ít nhất một trạng thái cuối cùng và chỉ một trạng thái ban đầu.\n Vui lòng quay lại và kiểm tra loại trạng thái.',
    },
  },
  customization: {
    customLookups: {
      allValues: 'Tất cả giá trị',
      code: 'Mã',
      columns: 'Cột',
      addColumn: 'Thêm cột',
      editColumn: 'Sửa cột',
      confirmDeleteColumn:
        'Sau khi xóa cột và lưu, tất cả dữ liệu đã nhập trong trường tương ứng cũng sẽ bị xóa.',
      controlPermissions: 'Kiểm soát quyền',
      field: {
        id: 'ID',
        name: ({ linked }) => linked('reusable.name'),
        createdAt: ({ linked }) => linked('reusable.createdAt'),
        createdBy: ({ linked }) => linked('reusable.createdBy'),
        modifiedAt: ({ linked }) => linked('reusable.modifiedAt'),
        modifiedBy: ({ linked }) => linked('reusable.modifiedBy'),
      },
      fieldType: {
        string: 'Văn bản',
        int32: 'Số',
        int64: 'Số',
        lookup: 'Chọn',
        list: 'Chọn nhiều',
        datetime: 'Lịch',
        bool: 'Boolean',
      },
    },
    extensions: {
      contacts: ({ linked }) => linked('contacts.contact'),
      cases: ({ linked }) => linked('cases.case'),
    },
  },
  cases: {
    case: 'Vụ việc | Vụ việc',
    id: 'ID',
    subject: 'Chủ đề',
    priority: 'Độ ưu tiên',
    status: 'Trạng thái',
    source: 'Nguồn',
    author: 'Tác giả',
    service: '@:lookups.service.service',
    assignee: '@:lookups.contactGroups.assignee',
    reporter: 'Người báo cáo',
    impacted: 'Bị ảnh hưởng',
    appliedSLA: 'SLA áp dụng',
    appliedCondition: 'Điều kiện áp dụng',
    reactionTime: '@:lookups.slas.reactionTime',
    resolutionTime: '@:lookups.slas.resolutionTime',
    actualReactionTime: 'Thời gian phản hồi thực tế',
    actualResolutionTime: 'Thời gian giải quyết thực tế',
    closureReason: 'Lý do đóng',
    result: 'Kết quả',
    rating: 'Đánh giá',
    persons: 'Người',
    selectAService: 'Chọn dịch vụ',
    deadlines: 'Thời hạn',
    ratingComment: 'Nhận xét đánh giá',
    caseResult: 'Kết quả vụ việc',
    assignToMe: 'Giao cho tôi',
    company: 'Công ty',
    department: 'Phòng ban',
    position: 'Vị trí',
    location: 'Địa điểm',
    serviceValidation: 'Vui lòng chọn dịch vụ trước',
    caseNumber: 'Số vụ việc',
    caseInfo: {
      caseInfo: 'Thông tin vụ việc',
      contactInfo: 'Thông tin liên hệ',
    },
    comments: {
      comments: 'Bình luận',
      edited: 'Đã sửa',
      yourCommentHere: 'Bình luận của bạn ở đây',
      emptyText: 'Chưa có bình luận nào',
    },
    attachments: {
      attachments: 'Tệp đính kèm',
      files: 'Tệp',
      links: 'Liên kết',
      url: 'URL',
      linkText: 'Văn bản liên kết',
      emptyFilesText: 'Chưa có tệp đính kèm nào',
      emptyLinksText: 'Chưa có liên kết nào',
    },
    details: {
      details: 'Chi tiết',
    },
    relatedCases: {
      relatedCases: 'Vụ việc liên quan',
      emptyText: 'Chưa có vụ việc liên quan nào',
      searchCasesPlaceholder: 'Tìm kiếm vụ việc',
      relationType: {
        [WebitelCasesRelationType.Duplicates]: 'trùng lặp với',
        [WebitelCasesRelationType.IsDuplicatedBy]: 'bị trùng lặp bởi',
        [WebitelCasesRelationType.Blocks]: 'chặn',
        [WebitelCasesRelationType.IsBlockedBy]: 'bị chặn bởi',
        [WebitelCasesRelationType.Causes]: 'gây ra',
        [WebitelCasesRelationType.IsCausedBy]: 'bị gây ra bởi',
        [WebitelCasesRelationType.IsChildOf]: 'là con của',
        [WebitelCasesRelationType.IsParentOf]: 'là cha của',
        [WebitelCasesRelationType.RelatesTo]: 'liên quan đến',
      },
    },
    slaRecalculationPopup: {
      title: 'Tính toán lại SLA',
      message:
        'Sau khi thay đổi dịch vụ và lưu, SLA của Vụ việc sẽ được tính toán lại.',
    },
  },
  filters: {
    search: {
      [SearchMode.Search]: 'Tìm kiếm thường',
      [SearchMode.Fts]: 'Tìm kiếm toàn văn',
    },
  },
};
