import {Injectable, Logger} from '@nestjs/common';
import {Mail} from "../../shared/entities/mail.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {SchedulerRegistry} from '@nestjs/schedule';
import {CronJob} from 'cron';
import {MailerService} from '@nestjs-modules/mailer';
import {timetrans} from "../../utils/time"

@Injectable()
export class MailService {
    constructor(
        @InjectRepository(Mail)
        private MailRepository: Repository<Mail>,
        private schedulerRegistry: SchedulerRegistry,
        private mailerService: MailerService
    ) {
    }


    async getAll() {
        const res = await this.MailRepository.find()
        // for (let i in res){
        //     console.log(res[i]["time_start"].toLocaleDateString())
        //     console.log(res[i]["time_start"].toLocaleString())
        // }
        // res['time_start'] = utc2beijing( res['time_start'])
        // res['time_end'] = utc2beijing( res['time_end'])
        return res
    }


    createMail(dto) {
        const {email, content, time_end} = dto

        const date = new Date(timetrans(time_end))
        const job = new CronJob(date, () => {
            this.mailerService.sendMail({
                to: email,
                from: "raseluxun@163.com",
                subject: content,
                text: "222"
            })
                .then(() => {
                    Logger.log("邮件id:" + dto.id + " 状态:发送成功")
                    this.MailRepository.update(dto.id, {type: 1})
                })
                .catch((err) => {
                    Logger.log("邮件id:" + dto.id + " 状态:发送失败" + " 原因" + err)
                    this.MailRepository.update(dto.id, {type: 2})
                })
        })


        this.schedulerRegistry.addCronJob(dto.id + time_end, job);
        job.start();


        return this.MailRepository.save(dto)
    }

    deleteMailByMailId(id) {
        return this.MailRepository.delete(id)
    }

    updateMailByMailId(dto) {
        return this.MailRepository.save(dto)
    }

    getMailByMailId(id) {
        return this.MailRepository.findByIds(id)
    }

    async init() {
        const res = await this.MailRepository.find({type: 0})
        for (const i in res) {
            this.createMail(res[i])
        }
    }

}
