import { Injectable, NotFoundException } from '@nestjs/common';
import { SidebarProject, VideoMetadata } from '../types';

@Injectable()
export class ProjectsService {
  private projects: SidebarProject[] = [
    {
      id: 'vintage-cinematic',
      title: 'Vintage Cinematic',
      duration: '00:30',
      durationInFrames: 900,
      thumbnail:
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=160&h=90&fit=crop&q=80',
      data: {
        themeColor: '#c89547',
        audioUrl: '',
        scenes: [
          {
            type: 'intro',
            title: 'REMOTION',
            subtitle: 'Chương I • Định Nghĩa Mới',
            description: 'Lập Trình & Thiết Kế Video Trực Tiếp Bằng React',
            imageUrl:
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'fade',
          },
          {
            type: 'react',
            title: 'Sức Mạng Từ React',
            subtitle: 'Thiết Kế Linh Hoạt',
            description:
              'Tự do sử dụng các Component, State, Props và toàn bộ hệ sinh thái khổng lồ từ NPM. Video của bạn giờ đây là một ứng dụng Web chất lượng cao, có thể lập trình được.',
            imageUrl:
              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'slide-left',
            customProps: {
              codeSnippet:
                'import React from "react";\nimport { Sequence } from "remotion";\n\nexport const MyVideo = () => {\n  return (\n    <Sequence>\n      <div className="text-gold">Chào mừng Remotion</div>\n    </Sequence>\n  );\n};',
            },
          },
          {
            type: 'precision',
            title: 'Chính Xác Khung Hình',
            subtitle: 'Độ Trễ Bằng Không',
            description:
              'Kết xuất video hoàn toàn khớp nhạc, đồng bộ âm thanh và hình ảnh tuyệt đối. Nói lời tạm biệt với hiện tượng giật lag hay mất khung hình khi render sản phẩm cuối.',
            imageUrl:
              'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'fade',
          },
          {
            type: 'audio',
            title: 'Hiệu Ứng Sóng Nhạc',
            subtitle: 'Đồng Bộ Âm Thanh',
            description:
              'Hỗ trợ bộ công cụ phân tích tần số âm thanh động. Bạn có thể dễ dàng thiết kế các cột sóng nhạc nhịp điệu hay hiệu ứng đồ họa co giãn theo âm bass trực quan.',
            imageUrl:
              'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'slide-right',
          },
          {
            type: 'scale',
            title: 'Tự Động Hóa Quy Mô',
            subtitle: 'Khả Năng Mở Rộng',
            description:
              'Tạo hàng ngàn video cá nhân hóa chỉ trong chốc lát. Tích hợp trơn tru hệ thống CI/CD để render tự động thông qua các nền tảng serverless hoặc Node APIs tiện lợi.',
            imageUrl:
              'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'fade',
          },
          {
            type: 'transitions',
            title: 'Bộ Lọc & Chuyển Cảnh',
            subtitle: 'Mỹ Thuật Điện Ảnh',
            description:
              'Tích hợp sẵn hàng loạt hiệu ứng chuyển tiếp như slide, fade, wipe, hay các bộ lọc ánh sáng rò rỉ (light leaks) nghệ thuật mang cảm hứng cổ điển đầy khác biệt.',
            imageUrl:
              'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'slide-left',
          },
          {
            type: 'performance',
            title: 'Kết Xuất Siêu Tốc',
            subtitle: 'Hiệu Suất Vượt Trội',
            description:
              'Tận dụng tối đa sức mạnh của CPU đa nhân cục bộ hoặc song song hóa quy trình kết xuất với hàng ngàn máy chủ Cloud để hoàn thành video dài chỉ trong vài giây.',
            imageUrl:
              'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 120,
            effect: 'fade',
          },
          {
            type: 'outro',
            title: 'Kiến Tạo Cùng Remotion',
            subtitle: 'Khám Phá Sức Sáng Tạo',
            description: 'remotion.dev • mã nguồn mở',
            imageUrl:
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 130,
            effect: 'none',
            customProps: {
              terminalCommand: 'npx create-video@latest',
            },
          },
        ],
      },
    },
    {
      id: 'tech-intro-v1',
      title: 'Tech Intro V1',
      duration: '00:15',
      durationInFrames: 450,
      thumbnail:
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=160&h=90&fit=crop&q=80',
      data: {
        themeColor: '#c89547',
        audioUrl: '',
        scenes: [
          {
            type: 'intro',
            title: 'VINTAGE INTRO',
            subtitle: 'Chương I • Định Nghĩa',
            description: 'Giao diện được lập trình hoàn toàn bằng React',
            imageUrl:
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 150,
            effect: 'fade',
          },
          {
            type: 'react',
            title: 'Công Nghệ React',
            subtitle: 'Component Tối Ưu',
            description: 'Trải nghiệm sức mạnh của lập trình hướng thành phần.',
            imageUrl:
              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 150,
            effect: 'slide-left',
          },
          {
            type: 'outro',
            title: 'KẾT THÚC',
            subtitle: 'Tạo Thêm Nhiều Hơn',
            description: 'npx create-video@latest',
            imageUrl:
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 150,
            effect: 'none',
          },
        ],
      },
    },
    {
      id: 'app-demo',
      title: 'App Demo',
      duration: '00:10',
      durationInFrames: 300,
      thumbnail:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&h=90&fit=crop&q=80',
      data: {
        themeColor: '#0284c7',
        audioUrl: '',
        scenes: [
          {
            type: 'react',
            title: 'APP INTERFACE',
            subtitle: 'Giao Diện Di Động',
            description:
              'Thiết kế app mượt mà và trực quan, hỗ trợ đa nền tảng.',
            imageUrl:
              'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 150,
            effect: 'fade',
          },
          {
            type: 'outro',
            title: 'TẢI XUỐNG NGAY',
            subtitle: 'Có Sẵn Trên Store',
            description: 'Nhận phiên bản thử nghiệm miễn phí.',
            imageUrl:
              'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 150,
            effect: 'none',
          },
        ],
      },
    },
    {
      id: 'marketing-clip',
      title: 'Marketing Clip',
      duration: '00:20',
      durationInFrames: 600,
      thumbnail:
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=160&h=90&fit=crop&q=80',
      data: {
        themeColor: '#a84a32',
        audioUrl: '',
        scenes: [
          {
            type: 'intro',
            title: 'CHIẾN DỊCH MỚI',
            subtitle: 'Marketing Kỹ Thuật Số',
            description:
              'Đột phá doanh thu cùng giải pháp tối ưu hóa hình ảnh.',
            imageUrl:
              'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 200,
            effect: 'fade',
          },
          {
            type: 'precision',
            title: 'Định Hướng Khách Hàng',
            subtitle: 'Chính Xác Target',
            description: 'Kết nối đúng thông điệp đến đúng đối tượng mục tiêu.',
            imageUrl:
              'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 200,
            effect: 'slide-right',
          },
          {
            type: 'outro',
            title: 'LIÊN HỆ CHÚNG TÔI',
            subtitle: 'Hotline: 1900-XXXX',
            description: 'Hãy bắt đầu dự án tiếp theo của bạn ngay hôm nay.',
            imageUrl:
              'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&h=720&q=80',
            durationInFrames: 200,
            effect: 'none',
          },
        ],
      },
    },
  ];

  findAll(): SidebarProject[] {
    return this.projects;
  }

  findOne(id: string): SidebarProject {
    const project = this.projects.find((p) => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  update(id: string, metadata: VideoMetadata): SidebarProject {
    const project = this.findOne(id);
    project.data = metadata;

    // Recalculate duration and frames
    let totalFrames = 0;
    const scenes = metadata.scenes || [];
    scenes.forEach((scene, index) => {
      totalFrames += scene.durationInFrames;
      const isLast = index === scenes.length - 1;
      if (!isLast && scene.effect !== 'none') {
        totalFrames -= 10;
      }
    });

    project.durationInFrames = totalFrames || 900;
    const totalSeconds = project.durationInFrames / 30;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    project.duration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return project;
  }

  addProject(project: SidebarProject) {
    this.projects.push(project);
  }
}
