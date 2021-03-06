import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IncomeType} from '../../../shared/income-type';
import {Subscription} from 'rxjs';
import {faEdit, faSave, faTimes, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {IncomeTypeService} from '../../../services/income-type.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {BasisService} from '../../../services/basis.service';

@Component({
  selector: 'app-income-type-edit',
  templateUrl: './income-type-edit.component.html',
  styleUrls: ['./income-type-edit.component.scss']
})
export class IncomeTypeEditComponent implements OnInit, OnDestroy {
  routeBack = '/incometype/list';
  visible = true;
  incomeTypeEditForm: FormGroup;
  incometypes = [];
  incomeType: IncomeType;
  basises: string[];
  sub: Subscription;
  fEdit = faEdit;
  fTrash = faTrashAlt;
  fSave = faSave;
  fBack = faTimes;

  constructor(private incomeTypeService: IncomeTypeService,
              private basisService: BasisService,
              private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private fb: FormBuilder) {
    this.incomeTypeEditForm = this.fb.group({
      incometype_id: [''],
      basis: [''],
      name: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.getIncomeType();
  }

  getIncomeType(): any {
    const id = +this.route.snapshot.paramMap.get('id');
    this.basisService.getBasises()
      .subscribe((basises) => {
        this.basises = basises;
        this.incomeTypeEditForm.controls.basises.patchValue(this.basises);
      });
    this.incomeTypeService.getIncomeType(id)
      .subscribe((incomeType) => {
        this.incomeType = incomeType;
        this.incomeTypeEditForm.controls.incometype_id.patchValue(this.incomeType.incometype_id);
        this.incomeTypeEditForm.controls.basis.patchValue(this.incomeType.basis);
        this.incomeTypeEditForm.controls.name.patchValue(this.incomeType.name);
        this.incomeTypeEditForm.controls.note.patchValue(this.incomeType.note);
           });
    this.incomeTypeService.getIncomeTypes()
      .subscribe((types) => {
        this.incometypes = types;
        this.incomeTypeEditForm.controls.incometype_id.patchValue(this.incomeType.incometype_id);
      });
   /* this.unitService.getUnits()
      .subscribe((units) => {
        this.units = units;
        this.incomeTypeEditForm.controls.unit_id.patchValue(this.incomeType.unit_id);
      });*/
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  submit(): void {
    if (this.incomeTypeEditForm.invalid) {
      return;
    }
    const incomeType: IncomeType = {
      incometype_id: this.incomeTypeEditForm.value.incometype_id,
      basis: this.incomeTypeEditForm.value.basis,
      name: this.incomeTypeEditForm.value.name,
      note: this.incomeTypeEditForm.value.note
    };
    this.incomeTypeService.saveIncomeType(incomeType)
      .subscribe(() => this.goBack());
    this.incomeTypeEditForm.reset();
  }

  delete(incomeType: IncomeType): void {
    this.incometypes = this.incometypes.filter(p => p !== incomeType);
    this.incomeTypeService.deleteIncomeType(incomeType).subscribe(() => this.goBack());
  }
  goBack(): void {
    this.router.navigate([this.routeBack]);
  }
}

