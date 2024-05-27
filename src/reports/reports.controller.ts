import { Controller, Get, Param, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Reportes')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/report-tasks/:id')
  async getTasksReport(@Param('id') id: string): Promise<any> {
    const pdfDoc = await this.reportsService.tasksReport(id);
   return pdfDoc;
  }

  @Get('/cert-laboral/:id')
  async certLaboral(@Param('id') id: string): Promise<any> {
    const pdfDoc = await this.reportsService.CertificadoLaboral(id);

    // response.setHeader('Content-Type', 'application/pdf');
    // response.setHeader('Content-Disposition', 'attachment; Certificado_laboral.pdf');
    return pdfDoc;
  
  }
}
