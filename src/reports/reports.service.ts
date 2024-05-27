import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrinterService } from './printer/printer.service';
import { tasksReport } from './documents/tasks.report';
import { TasksService } from '../tasks/tasks.service';
import { getEmploymentLetterByIdReport } from './documents/employment-letter-by-id.report';
import { AuthService } from 'src/auth/auth.service';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class ReportsService {
    constructor(private readonly printer: PrinterService,
                private readonly tasksService: TasksService,
                private readonly user: AuthService,
                private mailerService: MailerService
    ) {}
    
    async tasksReport(id: string) {
      const tasks = await this.tasksService.finAll();
      const user = await this.user.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      try {
      
        const docDefinition = tasksReport({tasks});
    
        const doc= this.printer.createPdf(docDefinition);
        let chunks = [];
          return new Promise((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', async () => {
              try {
                const pdfBuffer = Buffer.concat(chunks);
                await this.mailerService.sendMail({
                  to: user.correo,
                  subject: `Consolidado de tareas`,
                  // text: 'Please find the attached PDF.',
                  html: `
                  <p>Cordial Saludo ${user.nombre},</p><br>
                  <p>Se le ha enviado en este correo el Consolidado de Tareas correspondiente.</p>
                  <br>
                  <p>Atentamente,</p><br>
                  <p>TaskIn CORP</p>
                  `,
                  attachments: [
                    {
                      filename: 'Consolidado_Tareas.pdf',
                      content: pdfBuffer,
                      contentType: 'application/pdf'
                    }
                  ]
                });
      
                resolve({'message': 'Correo enviado correctamente'});
              } catch (mailError) {
                reject(new InternalServerErrorException('Error enviando el correo'));
              }
            });
            doc.on('error', (error) => reject(new InternalServerErrorException('Error generando el PDF')));
            doc.info.Title = 'Consolidado de Tareas';
            doc.end();
          });
        
      } catch (error) {
        throw new InternalServerErrorException('problema en la BD');
      }
       
      }


      async CertificadoLaboral(employeeId: string) {
        const employee = await this.user.findUserById(employeeId);
       
        if (!employee) {
          throw new NotFoundException(`Employee with id ${employeeId} not found`);
        }
    
        try {
          
          const docDefinition = getEmploymentLetterByIdReport({
          
            employeeName: employee.nombre,
            employeePosition: 'Colaborador',
            employeeHours: 40,
            employeeWorkSchedule: 'Lunes a Viernes',
            employerCompany: 'TaskIn CORP',
          });
      
          const doc = this.printer.createPdf(docDefinition);
          let chunks = [];
          return new Promise((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', async () => {
              try {
                const pdfBuffer = Buffer.concat(chunks);
                await this.mailerService.sendMail({
                  to: employee.correo,
                  subject: `Certificado laboral ${employee.nombre}`,
                  // text: 'Please find the attached PDF.',
                  html: `
                  <p>Cordial Saludo ${employee.nombre},</p><br>
                  <p>Se le a enviado en este correo el Certificado laboral correspondiente.</p>
                  <br>
                  <p>Atentamente,</p><br>
                  <p>TaskIn CORP</p>
                  `,
                  attachments: [
                    {
                      filename: 'Certificado_Laboral.pdf',
                      content: pdfBuffer,
                      contentType: 'application/pdf'
                    }
                  ]
                });
      
                resolve({'message': 'Correo enviado correctamente'});
              } catch (mailError) {
                reject(new InternalServerErrorException('Error enviando el correo'));
              }
            });
            doc.on('error', (error) => reject(new InternalServerErrorException('Error generando el PDF')));
            doc.info.Title = 'Certificado Laboral';
            doc.end();
          });
         
        } catch (error) {
          throw new InternalServerErrorException('problema en la BD');
        }
        
      }

    

}
